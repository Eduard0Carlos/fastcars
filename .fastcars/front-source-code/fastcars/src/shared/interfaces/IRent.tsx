export default interface IRent {
    id: string,
    vehicleOwnerId: string,
    vehicleOwnerImage: string,
    vehicleOwnerName: string,
    rentUserId: string,
    rentUserImage: string,
    rentUserName: string,
    vehicleId: string,
    vehicleName: string,
    vehicleImage: string,
    vehiclePrice: number,
    status: number,
    vehicleRentInitialDate: string,
    vehicleRentFinalDate: string,
    createdAt: string,
    smartSearch: string,
    totalDays: number
};