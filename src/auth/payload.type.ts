export interface PayLoadType{
    email: string;
    userId: number;
    artistId?: number;
}

export type Enable2FAType = {
    secret: string;
};