import { JWTPayload } from 'jose'

export interface SessionPayload extends JWTPayload {
  userId: string;
  expires: Date;
}
