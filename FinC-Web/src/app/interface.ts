import { Account } from "plaid";

export interface SimpleResponse {
    success: boolean
    error?: string
}

export interface LoginResponse extends SimpleResponse{
    username?: string
}

export interface InstitutionAccountsInfo {
    institution_name: string,
    accounts: Account[]
}

export interface AccountsQueryResponse extends SimpleResponse {
    institutions?: InstitutionAccountsInfo[]
    ins_id?: string
}

export interface UsernameQueryResponse extends SimpleResponse {
    username?: string
}

export interface InstitutionSummary {
    institution_name: string,
    // accounts_count: number,
    id: string
}

export interface InstitutionsSummary extends SimpleResponse{
    institutions: InstitutionSummary[]
}