export interface SeverityScale {
  name: string;
  symptomId: number;
  details: {
    [key: string]: number;
  };
}
