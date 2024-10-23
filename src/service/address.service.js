const Address = require("../model/address.model");

const createAddressService = async (data) => {
    try {
        let address = await Address.create(data);
        return address;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateAddressService = async (id, data) => {
    try {
        let address = await Address.findByIdAndUpdate(id, data)
        return address;
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteAddressService = async (id) => {
    try {
        let rs = await Address.findByIdAndDelete(id);
        return rs;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getAddressByUserService = async (userId) => {
    try {
        let rs = await Address.find({ user: userId });
        return rs;
    } catch (error) {
        throw new Error(error.message);
    }
}

const setDefaultAddressService = async (userId, addressId) => {
    try {
        await Address.updateMany({ user: userId }, { isDefault: false });
        let rs = await Address.findByIdAndUpdate(addressId, { isDefault: true });
        return rs;
    }
    catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    createAddressService,
    updateAddressService,
    deleteAddressService,
    getAddressByUserService,
    setDefaultAddressService,
};