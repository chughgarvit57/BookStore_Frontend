import AddressType from "../enums/AddressEnum";

const getAddressTypeLabel = (type) => {
    switch (type) {
        case AddressType.HOME:
            return "Home";
        case AddressType.WORK:
            return "Work";
        case AddressType.OTHER:
            return "OTHER";
        default:
            return "";
    }
}

export default getAddressTypeLabel;