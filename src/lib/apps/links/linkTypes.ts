export interface newLinkRequest {
    linkToken: string;
    requestId: string;
    clientId: number;
    expiration: Date;
}

export interface LinkRequest extends newLinkRequest {
  id: number;
  linkSessionId: string;
  errorType: string;
  errorCode: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;    
}

interface BaseWebhookRequest {
    webhook_type: string;
    webhook_code: string;
    link_session_id: string;
    link_token: string;
  }
  
  interface EnvironmentRequest extends BaseWebhookRequest {
    environment: string;
  }
  
export interface ItemAddResultRequest extends EnvironmentRequest {
    public_token: string;
  }
  
export interface EventsRequest extends BaseWebhookRequest {
    events: Array<{
      event_name: string;
      timestamp: string;
      event_id: string;
      event_metadata: {
        error_code: string;
        error_message: string;
        error_type: string;
        exit_status: string;
        institution_id: string;
        institution_name: string;
        institution_search_query: string;
        request_id: string;
        mfa_type: string;
        view_name: string;
        selection: string;
        brand_name: string;
        match_reason: string;
        routing_number: string;
        account_number_mask: string;
      };
    }>;
  }
  
export interface SessionFinishedRequest extends EnvironmentRequest {
    status: string;
    public_tokens: Array<string>;
  }

export interface InstGetByIdResponse {
  institution: {
    institution_id: string;
    name: string;
    products: string[];
    country_codes: string[];
    url: string;
    primary_color: string;
    logo: string;
    routing_numbers: string[];
    dtc_numbers: string[];
    oauth: boolean;
    status: Record<any,any>;
    payment_initiation_metadata: Record<any,any>;
    auth_metadata: Record<any,any>;
  };
  request_id: string;
}