export default interface IVehicle {
    id: string,
    name: string,
    brand: string,
    cep: string,
    country: string,
    city: string,
    uf: string,
    type: string,
    stars: number,
    image: string,
    price: number,
    location: string,
    smartSearch: string,
    createdByUserId: string,
    userName: string,
    userImage: string,
    fabricationYear: string,
    color: string,
    maxPersons: string,
    maxDoors: string,
    plate: string,
    userStars: number,
    totalReceipt: number,
    totalRent: number,
    disponibility: string[]
}