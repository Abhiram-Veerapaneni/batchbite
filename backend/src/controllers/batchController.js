import Batch from "../models/Batch.js";
import Agent from "../models/Agent.js";

// GET /api/batches
export const getAllBatches = async (req, res) => {

    try {

        const batches = await Batch.find()
            .populate("slot")
            .populate("agent")
            .populate("restaurantZone")
            .populate("deliveryZone")
            .populate("agent")
            .sort({ createdAt: -1 })
        
        res.status(200).json(batches);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch batches"
        });
    }
}

// GET /api/batches/:id
export const getBatchById = async (req, res) => {

    try {

        const batch = await Batch.findById(req.params.id)
            .populate("slot")
            .populate("agent")
            .populate({
                path: "orders",
                populate: { path: "user" }
            })

        if (!batch) {
            return res.status(404).json({
                message: "Batch not found"
            });
        }

        res.status(200).json(batch);
        
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch batches"
        });
    }
}

// to assign 
// PATCH /api/batches/:id/assign
export const assignBatch = async (req, res) => {

    try {
        
        const { agentId } = req.body;
        
        const batch = await Batch.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({
                message: "Batch not found"
            });
        }

        const agent = await Agent.findById(agentId);

        if (!agent) {
            return res.status(404).json({
                message: "Agent not found"
            });
        }

        if(agent.status !== "available") {
            return res.status(400).json({
                message: "Agent is not available"
            });
        }

        // assign batch
        batch.agent = agent._id;
        batch.status = "assigned";
        await batch.save();
        
        // update agent
        agent.currentBatch = batch._id;
        agent.status = "busy";
        await agent.save();

        return res.status(200).json({
                message: `Batch assigned successfully to agent ${agent.name}`
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Failed to assign batch"
        });
    }
}