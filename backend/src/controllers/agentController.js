import Agent from "../models/Agent.js";
import Batch from "../models/Batch.js";
import Order from "../models/Order.js";

// CRUD APIs

// GET /api/agents
export const getAllAgents = async (req, res) => {

    try {

        const agents = await Agent.find()
            .populate({
                path: "currentBatch",
                populate : [
                    { path: "deliveryZone" },
                    { path: "restaurantZone"}
                ]
            })
            .sort({ createdAt: -1 })

        res.status(200).json(agents);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Falied to fetch agents"
        })
    }
}

// GET /api/agents/:id
export const getAgentByID = async (req, res) => {

    try {

        const agent = await Agent.findById(
            req.params.id
        ).populate("currentBatch")

        if (!agent) {

            res.status(404).json({
                message: "Agent not found"
            })
        }

        res.status(200).json(agent);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Falied to fetch agent"
        })
    }
}


// PATCH /api/agents/:id
export const updateAgent = async (req, res) => {

    try {

        const { name, phone, zones, status } = req.body;

        const agent = await Agent.findById(req.params.id)

        if (!agent) {

            res.status(404).json({
                message: "Agent not found"
            })
        }

        if (name !== undefined) agent.name = name;
        if (phone !== undefined) agent.phone = phone;
        if (zones !== undefined) agent.zones = zones;
        if (status !== undefined) agent.status = status;

        await agent.save();
        res.status(200).json(agent);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Falied to update agent"
        })
    }
}

// DELETE /api/agents/:id
export const deleteAgent = async (req, res) => {

    try {

        const agent = await Agent.findById(req.params.id)

        if (!agent) {

            res.status(404).json({
                message: "Agent not found"
            })
        }

        // don't delete a busy agent
        if (agent.status === "busy") {

            return res.status(400).json({
                message: "Cannot delete a busy agent"
            })
        }

        await Agent.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "Agent deleted successfully"
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Falied to delete agent"
        })
    }
}


// for AGENT
// GET /api/agents/current-batch
export const getCurrentBatch = async (req, res) => {

    const agentId = req.agent._id;

    const agent = await Agent.findById(agentId)
        .populate({
            path: "currentBatch",
            populate: ["restaurantZone", "deliveryZone", "slot"]
        });

    res.json(agent.currentBatch);
};

// PATCH /api/batches/:id/pick-up
export const pickUpBatch = async (req, res) => {

    const batch = await Batch.findById(req.params.id);

    batch.status = "out_for_delivery";

    await batch.save();

    // await Order.updateMany(
    //     { _id: { $in: batch.orders } },
    //     { $set: { status: "out_for_delivery" } }
    // );

    res.json({ message: "Picked up" });
};

// PATCH /api/batches/:id/deliver
export const deliverBatch = async (req, res) => {

    const batch = await Batch.findById(req.params.id);

    batch.status = "delivered";

    await batch.save();

    await Order.updateMany(
        { _id: { $in: batch.orders } },
        { $set: { status: "delivered" } }
    );

    await Agent.findByIdAndUpdate(batch.agent, {
        status: "available",
        currentBatch: null
    });

    res.json({ message: "Delivered" });
};

// GET /api/agent/delivery-history
export const getDeliveryHistory = async (req, res) => {

    try {
        
        const batches = await Batch.find({
            agent: req.agent._id,
            status: "delivered"
        })
        .populate(["restaurantZone" , "deliveryZone"])
        .sort({ updatedAt : -1})

        res.status(200).json(batches);

    } catch (error) {
        
        console.log(error);
    }
}