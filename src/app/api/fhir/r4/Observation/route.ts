import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const patientId = searchParams.get('patient') || 'PAT-101';

  const fhirObservationBundle = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: 2,
    entry: [
      {
        fullUrl: `https://api.clinicacrm.com/fhir/r4/Observation/obs-hba1c-101`,
        resource: {
          resourceType: 'Observation',
          id: 'obs-hba1c-101',
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'laboratory',
                  display: 'Laboratory'
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '4548-4',
                display: 'Hemoglobin A1c/Hemoglobin.total in Blood'
              }
            ],
            text: 'HbA1c'
          },
          subject: {
            reference: `Patient/${patientId}`
          },
          effectiveDateTime: new Date().toISOString(),
          valueQuantity: {
            value: 8.4,
            unit: '%',
            system: 'http://unitsofmeasure.org',
            code: '%'
          },
          interpretation: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                  code: 'H',
                  display: 'High'
                }
              ]
            }
          ]
        }
      },
      {
        fullUrl: `https://api.clinicacrm.com/fhir/r4/Observation/obs-bp-101`,
        resource: {
          resourceType: 'Observation',
          id: 'obs-bp-101',
          status: 'final',
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '85354-9',
                display: 'Blood pressure panel with all children optional'
              }
            ],
            text: 'Blood Pressure'
          },
          subject: {
            reference: `Patient/${patientId}`
          },
          effectiveDateTime: new Date().toISOString(),
          component: [
            {
              code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] },
              valueQuantity: { value: 154, unit: 'mmHg' }
            },
            {
              code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] },
              valueQuantity: { value: 96, unit: 'mmHg' }
            }
          ]
        }
      }
    ]
  };

  return NextResponse.json(fhirObservationBundle, {
    headers: {
      'Content-Type': 'application/fhir+json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
