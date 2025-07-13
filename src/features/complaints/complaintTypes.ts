export interface ComplaintListDto {
  id: number;
  title: string;
  resumedDescription: string;
  status: string;
  createdAt: string;
  deletedAt?:string | null;
  priority: string;
}
  
export interface ComplaintDetailDto {
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  cpf: string;
  email: string;
  priority: string
}

export interface ComplaintUpdateDto{
  description: string;
  status: string;
}

export enum ComplaintStatusEnum {
  PENDENTE = 'PENDENTE',
  RESOLVIDO = 'RESOLVIDO',
  NAO_CONCLUIDO = 'NAO_CONCLUIDO'
}

export enum ComplaintPriority{
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA'
}