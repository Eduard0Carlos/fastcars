export default interface IOrdenation<T> {
    showName: string,
    value: (objectA:T, objectB:T) => number
}