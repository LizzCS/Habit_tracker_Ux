//crud paste here
import { apiFetch } from "../lib/API";
import { RecordForm } from "../forms/RecordForm";

//Read Record
export async function getRecords(): Promise<RecordForm[]> {
  return apiFetch("/records");
}

//update Record
export async function updateRecord(
  id: string,
  data: { amount?: number; completed?: boolean },
): Promise<RecordForm> {
  return apiFetch(`/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
//create
export async function createRecord(
  habitId: string,
  amount: number,
  date: Date,
): Promise<RecordForm> {
  return await apiFetch(`/records/${habitId}/complete`, {
    method: "POST",
    body: JSON.stringify({
      amount,
      date: date.toISOString(),
    }),
  });
}

//delte
export async function deleteRecord(id: string) {
  return apiFetch(`/records/${id}`, {
    method: "DELETE",
  });
}
