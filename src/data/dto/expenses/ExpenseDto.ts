import {ExpenseFrequency} from
  '../../../services/expenses/enum/expense-frequency';

export interface ExpenseDto {
    id: string;
    propertyId: string;
    amount: string;
    frequency: ExpenseFrequency;
    createdBy: string;
}
