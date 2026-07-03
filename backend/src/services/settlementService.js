import crypto from "crypto";

import RestaurantLedger from "../models/RestaurantLedger.js";
import { ApiError } from "../utils/apiError.js";


export const settleRestaurantLedger = async (ledgerId) => {

    const ledger = await RestaurantLedger.findById(ledgerId);

    console.log("hello")

    if (!ledger) {
        throw new ApiError(404, "Ledger not found");
        throw new ApiError
    }

    if (ledger.status !== "receivable") {
        throw new ApiError(
            400,
            "Settlement is not available for this ledger"
        );
    }

    ledger.status = "settled";

    ledger.settledAt = new Date();

    ledger.settlementReference =
        `SETTLE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    await ledger.save();

    return ledger;
};