import type {
	Contract,
	ContractCreate,
	ContractUpdate,
	Elevator,
	ElevatorCreate,
	ElevatorUpdate,
	ElevatorUser,
	ElevatorUserCreate,
	ElevatorUserUpdate,
	File,
	FileCreate,
	FileUpdate,
	Incident,
	IncidentCreate,
	IncidentUpdate,
	LoginRequest,
	PasswordChangeRequest,
	RefreshTokenRequest,
	TokenResponse,
	User,
	UserCreate,
	UserUpdate,
} from './api'

export interface LoginEndpoint {
	method: 'POST'
	path: 'auth/login'
	requestBody: LoginRequest
	response: TokenResponse
	requireAuth: false
}

export interface RefreshTokenEndpoint {
	method: 'POST'
	path: 'auth/refresh_token'
	requestBody: RefreshTokenRequest
	response: TokenResponse
	requireAuth: false
}

export interface LogoutEndpoint {
	method: 'POST'
	path: 'auth/logout'
	requestBody: never
	response: void
	requireAuth: true
}

export interface ChangePasswordEndpoint {
	method: 'POST'
	path: 'auth/password'
	requestBody: PasswordChangeRequest
	response: void
	requireAuth: true
}

export interface GetCurrentUserEndpoint {
	method: 'GET'
	path: 'users/me'
	requestBody: never
	response: User
	requireAuth: true
}

export interface GetUsersEndpoint {
	method: 'GET'
	path: 'users'
	requestBody: never
	response: User[]
	requireAuth: true
}

export interface CreateUserEndpoint {
	method: 'POST'
	path: 'users'
	requestBody: UserCreate
	response: User
	requireAuth: true
}

export interface GetUserEndpoint {
	method: 'GET'
	path: 'users/{user_id}'
	params: { user_id: string }
	requestBody: never
	response: User
	requireAuth: true
}

export interface UpdateUserEndpoint {
	method: 'PUT'
	path: 'users/{user_id}'
	params: { user_id: string }
	requestBody: UserUpdate
	response: User
	requireAuth: true
}

export interface DeleteUserEndpoint {
	method: 'DELETE'
	path: 'users/{user_id}'
	params: { user_id: string }
	requestBody: never
	response: void
	requireAuth: true
}

export interface GetElevatorsEndpoint {
	method: 'GET'
	path: 'elevators'
	requestBody: never
	response: Elevator[]
	requireAuth: true
}

export interface CreateElevatorEndpoint {
	method: 'POST'
	path: 'elevators'
	requestBody: ElevatorCreate
	response: Elevator
	requireAuth: true
}

export interface GetElevatorEndpoint {
	method: 'GET'
	path: 'elevators/{elevator_id}'
	params: { elevator_id: string }
	requestBody: never
	response: Elevator
	requireAuth: true
}

export interface UpdateElevatorEndpoint {
	method: 'PUT'
	path: 'elevators/{elevator_id}'
	params: { elevator_id: string }
	requestBody: ElevatorUpdate
	response: Elevator
	requireAuth: true
}

export interface DeleteElevatorEndpoint {
	method: 'DELETE'
	path: 'elevators/{elevator_id}'
	params: { elevator_id: string }
	requestBody: never
	response: void
	requireAuth: true
}

export interface GetElevatorUsersEndpoint {
	method: 'GET'
	path: 'elevator-users'
	requestBody: never
	response: ElevatorUser[]
	requireAuth: true
}

export interface CreateElevatorUserEndpoint {
	method: 'POST'
	path: 'elevator-users'
	requestBody: ElevatorUserCreate
	response: ElevatorUser
	requireAuth: true
}

export interface GetElevatorUserEndpoint {
	method: 'GET'
	path: 'elevator-users/{elevator_user_id}'
	params: { elevator_user_id: string }
	requestBody: never
	response: ElevatorUser
	requireAuth: true
}

export interface UpdateElevatorUserEndpoint {
	method: 'PUT'
	path: 'elevator-users/{elevator_user_id}'
	params: { elevator_user_id: string }
	requestBody: ElevatorUserUpdate
	response: ElevatorUser
	requireAuth: true
}

export interface DeleteElevatorUserEndpoint {
	method: 'DELETE'
	path: 'elevator-users/{elevator_user_id}'
	params: { elevator_user_id: string }
	requestBody: never
	response: void
	requireAuth: true
}

export interface GetUsersByElevatorEndpoint {
	method: 'GET'
	path: 'elevator-users/elevator/{elevator_id}'
	params: { elevator_id: string }
	requestBody: never
	response: ElevatorUser[]
	requireAuth: true
}

export interface GetElevatorsByUserEndpoint {
	method: 'GET'
	path: 'elevator-users/user/{user_id}'
	params: { user_id: string }
	requestBody: never
	response: ElevatorUser[]
	requireAuth: true
}

export interface GetContractsEndpoint {
	method: 'GET'
	path: 'contracts'
	requestBody: never
	response: Contract[]
	requireAuth: true
}

export interface CreateContractEndpoint {
	method: 'POST'
	path: 'contracts'
	requestBody: ContractCreate
	response: Contract
	requireAuth: true
}

export interface GetContractEndpoint {
	method: 'GET'
	path: 'contracts/{contract_id}'
	params: { contract_id: string }
	requestBody: never
	response: Contract
	requireAuth: true
}

export interface UpdateContractEndpoint {
	method: 'PUT'
	path: 'contracts/{contract_id}'
	params: { contract_id: string }
	requestBody: ContractUpdate
	response: Contract
	requireAuth: true
}

export interface DeleteContractEndpoint {
	method: 'DELETE'
	path: 'contracts/{contract_id}'
	params: { contract_id: string }
	requestBody: never
	response: void
	requireAuth: true
}

export interface GetContractsByElevatorEndpoint {
	method: 'GET'
	path: 'contracts/elevator/{elevator_id}'
	params: { elevator_id: string }
	requestBody: never
	response: Contract[]
	requireAuth: true
}

export interface GetContractsByCustomerEndpoint {
	method: 'GET'
	path: 'contracts/customer/{customer_id}'
	params: { customer_id: string }
	requestBody: never
	response: Contract[]
	requireAuth: true
}

export interface GetIncidentsEndpoint {
	method: 'GET'
	path: 'incidents'
	requestBody: never
	response: Incident[]
	requireAuth: true
}

export interface CreateIncidentEndpoint {
	method: 'POST'
	path: 'incidents'
	requestBody: IncidentCreate
	response: Incident
	requireAuth: true
}

export interface GetIncidentEndpoint {
	method: 'GET'
	path: 'incidents/{incident_id}'
	params: { incident_id: string }
	requestBody: never
	response: Incident
	requireAuth: true
}

export interface UpdateIncidentEndpoint {
	method: 'PUT'
	path: 'incidents/{incident_id}'
	params: { incident_id: string }
	requestBody: IncidentUpdate
	response: Incident
	requireAuth: true
}

export interface DeleteIncidentEndpoint {
	method: 'DELETE'
	path: 'incidents/{incident_id}'
	params: { incident_id: string }
	requestBody: never
	response: void
	requireAuth: true
}

export interface GetIncidentsByElevatorEndpoint {
	method: 'GET'
	path: 'incidents/elevator/{elevator_id}'
	params: { elevator_id: string }
	requestBody: never
	response: Incident[]
	requireAuth: true
}

export interface GetIncidentsByAssignedUserEndpoint {
	method: 'GET'
	path: 'incidents/assigned/{user_id}'
	params: { user_id: string }
	requestBody: never
	response: Incident[]
	requireAuth: true
}

export interface GetFilesEndpoint {
	method: 'GET'
	path: 'files'
	requestBody: never
	response: File[]
	requireAuth: true
}

export interface CreateFileEndpoint {
	method: 'POST'
	path: 'files'
	requestBody: FileCreate
	response: File
	requireAuth: true
}

export interface GetFileEndpoint {
	method: 'GET'
	path: 'files/{file_id}'
	params: { file_id: string }
	requestBody: never
	response: File
	requireAuth: true
}

export interface UpdateFileEndpoint {
	method: 'PUT'
	path: 'files/{file_id}'
	params: { file_id: string }
	requestBody: FileUpdate
	response: File
	requireAuth: true
}

export interface DeleteFileEndpoint {
	method: 'DELETE'
	path: 'files/{file_id}'
	params: { file_id: string }
	requestBody: never
	response: void
	requireAuth: true
}

export interface GetFilesByEntityEndpoint {
	method: 'GET'
	path: 'files/entity/{entity_type}/{entity_id}'
	params: { entity_type: string; entity_id: string }
	requestBody: never
	response: File[]
	requireAuth: true
}
