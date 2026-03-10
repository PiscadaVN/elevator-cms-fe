export interface LoginRequest {
	username: string
	password: string
	grant_type?: string | null
	scope?: string
	client_id?: string | null
	client_secret?: string | null
}

export interface TokenResponse {
	access_token: string
	refresh_token: string
	token_type: string
}

export interface RefreshTokenRequest {
	refresh_token: string
}

export interface PasswordChangeRequest {
	old_password: string
	new_password: string
}

export type Role = 'superadmin' | 'admin' | 'operator' | 'viewer'

export interface UserCreate {
	id?: string | null
	full_name: string
	phone: string
	email: string
	password: string
	role?: Role | null
	is_active?: boolean | null
	deleted_at?: number | null
}

export interface UserUpdate {
	id?: string | null
	full_name?: string | null
	phone?: string | null
	email?: string | null
	password?: string | null
	role?: Role | null
	is_active?: boolean | null
	deleted_at?: number | null
}

export interface User {
	id: string
	full_name: string
	phone: string
	email: string
	role: Role
	is_active: boolean
	created_at?: number
	updated_at?: number
	deleted_at?: number | null
}

export type ElevatorStatus = 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_ORDER'

export interface ElevatorCreate {
	id?: string | null
	elevator_code: string
	name?: string | null
	address?: string | null
	description?: string | null
	min_floor?: number | null
	max_floor?: number | null
	status?: ElevatorStatus | null
	installation_at?: number | null
	maintenance_cycle_months?: number | null
}

export interface ElevatorUpdate {
	id?: string | null
	elevator_code?: string | null
	name?: string | null
	address?: string | null
	description?: string | null
	min_floor?: number | null
	max_floor?: number | null
	status?: ElevatorStatus | null
	installation_at?: number | null
	maintenance_cycle_months?: number | null
}

export interface Elevator {
	id: string
	elevator_code: string
	name?: string | null
	address?: string | null
	description?: string | null
	min_floor?: number | null
	max_floor?: number | null
	status: ElevatorStatus
	installation_at?: number | null
	maintenance_cycle_months?: number | null
	created_at?: number
	updated_at?: number
}

export type RelationType = 'TECHNICIAN' | 'VIEWER'

export interface ElevatorUserCreate {
	id?: string | null
	elevator_id: string
	user_id: string
	relation_type: RelationType
}

export interface ElevatorUserUpdate {
	id?: string | null
	elevator_id?: string | null
	user_id?: string | null
	relation_type?: RelationType | null
}

export interface ElevatorUser {
	id: string
	elevator_id: string
	user_id: string
	relation_type: RelationType
	created_at?: number
	updated_at?: number
}

export interface ContractCreate {
	id?: string | null
	elevator_id: string
	customer_id: string
	signed_at?: number | null
	expired_at?: number | null
	contract_value?: number | string | null
	description?: string | null
	is_active?: boolean | null
}

export interface ContractUpdate {
	id?: string | null
	elevator_id?: string | null
	customer_id?: string | null
	signed_at?: number | null
	expired_at?: number | null
	contract_value?: number | string | null
	description?: string | null
	is_active?: boolean | null
}

export interface Contract {
	id: string
	elevator_id: string
	customer_id: string
	signed_at?: number | null
	expired_at?: number | null
	contract_value?: number | null
	description?: string | null
	is_active: boolean
	created_at?: number
	updated_at?: number
}

export type IncidentStatus = 'NEW' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'COMPLETED' | 'REJECTED'

export interface IncidentCreate {
	id?: string | null
	title: string
	elevator_id: string
	description?: string | null
	reported_user?: string | null
	assigned_user?: string | null
	priority?: number | null
	status?: IncidentStatus | null
}

export interface IncidentUpdate {
	id?: string | null
	title?: string | null
	elevator_id?: string | null
	description?: string | null
	reported_user?: string | null
	assigned_user?: string | null
	priority?: number | null
	status?: IncidentStatus | null
}

export interface Incident {
	id: string
	title: string
	elevator_id: string
	description?: string | null
	reported_user?: string | null
	assigned_user?: string | null
	priority?: number | null
	status: IncidentStatus
	created_at?: number
	updated_at?: number
}

export type EntityType = 'CONTRACT' | 'INCIDENT'

export interface FileCreate {
	id?: string | null
	entity_type: EntityType
	entity_id: string
	file_url: string
	file_name?: string | null
	file_type?: string | null
	uploaded_user?: string | null
}

export interface FileUpdate {
	id?: string | null
	entity_type?: EntityType | null
	entity_id?: string | null
	file_url?: string | null
	file_name?: string | null
	file_type?: string | null
	uploaded_user?: string | null
}

export interface File {
	id: string
	entity_type: EntityType
	entity_id: string
	file_url: string
	file_name?: string | null
	file_type?: string | null
	uploaded_user?: string | null
	created_at?: number
	updated_at?: number
}

export interface ValidationError {
	loc: (string | number)[]
	msg: string
	type: string
}

export interface HTTPValidationError {
	detail?: ValidationError[]
}

export interface ApiResponse<T = unknown> {
	data?: T
	error?: string
	detail?: ValidationError[]
}
