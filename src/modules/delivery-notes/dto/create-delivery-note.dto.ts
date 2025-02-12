import { IsNotEmpty } from "class-validator";

export class CreateDeliveryNoteDTO {
  @IsNotEmpty()
  order: string;
}
