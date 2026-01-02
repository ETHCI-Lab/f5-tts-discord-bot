export interface response<E> {
    code: string,
    message: string,
    body: E
}