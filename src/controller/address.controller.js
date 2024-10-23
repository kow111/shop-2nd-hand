const {
    createAddressService,
    updateAddressService,
    deleteAddressService,
    getAddressByUserService,
    setDefaultAddressService,
} = require("../service/address.service");

const postCreateAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const address = req.body;
        address.user = userId;
        const rs = await getAddressByUserService(userId);
        if (rs.length === 6) {
            return res.status(400).json({
                DT: null,
                EM: "You can only have 6 addresses",
            });
        }
        await createAddressService(address);
        return res.status(200).json({
            DT: null,
            EM: "Create address successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
};

const putUpdateAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const data = req.body;
        await updateAddressService(addressId, data);
        return res.status(200).json({
            DT: null,
            EM: "Update address successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        await deleteAddressService(addressId);
        return res.status(200).json({
            DT: null,
            EM: "Delete address successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const getAddressByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const rs = await getAddressByUserService(userId);
        return res.status(200).json({
            DT: rs,
            EM: "Get address successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = req.params.addressId;
        await setDefaultAddressService(userId, addressId);
        return res.status(200).json({
            DT: null,
            EM: "Set default address successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

module.exports = {
    postCreateAddress,
    putUpdateAddress,
    deleteAddress,
    getAddressByUser,
    setDefaultAddress,
};