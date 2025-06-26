export interface CheckPointUploadResponse {
  response: {
    status: {
      code: number;
      label: string;
      message: string;
    };
    md5: string;
    sha1: string;
    sha256: string;
    file_name: string;
    file_type: string;
    features: string[];
  };
}

export interface CheckPointQueryResponse {
  response: {
    status: {
      code: number;
      label: string;
      message: string;
    };
    md5: string;
    te: {
      combined_verdict: string;
      status: {
        code: number;
        label: string;
        message: string;
      };
    };
  };
}
