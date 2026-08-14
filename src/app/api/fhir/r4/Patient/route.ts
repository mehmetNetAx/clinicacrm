import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const patientId = searchParams.get('id') || 'PAT-101';

  const fhirPatientBundle = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: 1,
    entry: [
      {
        fullUrl: `https://api.clinicacrm.com/fhir/r4/Patient/${patientId}`,
        resource: {
          resourceType: 'Patient',
          id: patientId,
          meta: {
            versionId: '1',
            lastUpdated: new Date().toISOString(),
            profile: ['http://hl7.org/fhir/StructureDefinition/Patient']
          },
          identifier: [
            {
              system: 'urn:oid:2.16.840.1.113883.2.4.6.3',
              value: '10029384712'
            }
          ],
          active: true,
          name: [
            {
              use: 'official',
              family: 'Yılmaz',
              given: ['Ahmet']
            }
          ],
          telecom: [
            { system: 'phone', value: '+90 532 100 20 30', use: 'mobile' },
            { system: 'email', value: 'ahmet.yilmaz@example.com', use: 'home' }
          ],
          gender: 'male',
          birthDate: '1976-04-12',
          address: [
            {
              use: 'home',
              city: 'İstanbul',
              country: 'TUR'
            }
          ]
        }
      }
    ]
  };

  return NextResponse.json(fhirPatientBundle, {
    headers: {
      'Content-Type': 'application/fhir+json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
