import { NextRequest, NextResponse } from 'next/server';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';

// Simplified zip code to state mapping
const ZIP_TO_STATE: Record<string, string> = {
  // Major zip code ranges for each state
  '35000': 'AL', '36000': 'AL', '36500': 'AL', '36600': 'AL', '36700': 'AL', '36800': 'AL', '36900': 'AL',
  '99500': 'AK', '99600': 'AK', '99700': 'AK', '99800': 'AK', '99900': 'AK',
  '85000': 'AZ', '85100': 'AZ', '85200': 'AZ', '85300': 'AZ', '85500': 'AZ', '85600': 'AZ', '85700': 'AZ', '85900': 'AZ', '86000': 'AZ', '86300': 'AZ', '86400': 'AZ', '86500': 'AZ',
  '71600': 'AR', '71700': 'AR', '71800': 'AR', '71900': 'AR', '72000': 'AR', '72100': 'AR', '72200': 'AR', '72300': 'AR', '72400': 'AR', '72500': 'AR', '72600': 'AR', '72700': 'AR', '72800': 'AR', '72900': 'AR',
  '90000': 'CA', '90100': 'CA', '90200': 'CA', '90300': 'CA', '90400': 'CA', '90500': 'CA', '90600': 'CA', '90700': 'CA', '90800': 'CA', '91000': 'CA', '91100': 'CA', '91200': 'CA', '91300': 'CA', '91400': 'CA', '91500': 'CA', '91600': 'CA', '91700': 'CA', '91800': 'CA', '91900': 'CA', '92000': 'CA', '92100': 'CA', '92200': 'CA', '92300': 'CA', '92400': 'CA', '92500': 'CA', '92600': 'CA', '92700': 'CA', '92800': 'CA', '93000': 'CA', '93100': 'CA', '93200': 'CA', '93300': 'CA', '93400': 'CA', '93500': 'CA', '93600': 'CA', '93700': 'CA', '93800': 'CA', '93900': 'CA', '94000': 'CA', '94100': 'CA', '94200': 'CA', '94300': 'CA', '94400': 'CA', '94500': 'CA', '94600': 'CA', '94700': 'CA', '94800': 'CA', '94900': 'CA', '95000': 'CA', '95100': 'CA', '95200': 'CA', '95300': 'CA', '95400': 'CA', '95500': 'CA', '95600': 'CA', '95700': 'CA', '95800': 'CA', '95900': 'CA', '96000': 'CA', '96100': 'CA', '96200': 'CA',
  '80000': 'CO', '80100': 'CO', '80200': 'CO', '80300': 'CO', '80400': 'CO', '80500': 'CO', '80600': 'CO', '80700': 'CO', '80800': 'CO', '80900': 'CO', '81000': 'CO', '81100': 'CO', '81200': 'CO', '81300': 'CO', '81400': 'CO', '81500': 'CO', '81600': 'CO',
  '06000': 'CT', '06100': 'CT', '06200': 'CT', '06300': 'CT', '06400': 'CT', '06500': 'CT', '06600': 'CT', '06700': 'CT', '06800': 'CT', '06900': 'CT',
  '19700': 'DE', '19800': 'DE', '19900': 'DE',
  '32000': 'FL', '32100': 'FL', '32200': 'FL', '32300': 'FL', '32400': 'FL', '32500': 'FL', '32600': 'FL', '32700': 'FL', '32800': 'FL', '32900': 'FL', '33000': 'FL', '33100': 'FL', '33200': 'FL', '33300': 'FL', '33400': 'FL', '33500': 'FL', '33600': 'FL', '33700': 'FL', '33800': 'FL', '33900': 'FL', '34000': 'FL', '34100': 'FL', '34200': 'FL', '34400': 'FL', '34600': 'FL', '34700': 'FL', '34900': 'FL',
  '30000': 'GA', '30100': 'GA', '30200': 'GA', '30300': 'GA', '30500': 'GA', '30600': 'GA', '30700': 'GA', '30800': 'GA', '30900': 'GA', '31000': 'GA', '31100': 'GA', '31200': 'GA', '31300': 'GA', '31400': 'GA', '31500': 'GA', '31600': 'GA', '31700': 'GA', '31800': 'GA', '31900': 'GA',
  '96700': 'HI', '96800': 'HI',
  '83200': 'ID', '83300': 'ID', '83400': 'ID', '83500': 'ID', '83600': 'ID', '83700': 'ID', '83800': 'ID',
  '60000': 'IL', '60100': 'IL', '60200': 'IL', '60300': 'IL', '60400': 'IL', '60500': 'IL', '60600': 'IL', '60700': 'IL', '60800': 'IL', '60900': 'IL', '61000': 'IL', '61100': 'IL', '61200': 'IL', '61300': 'IL', '61400': 'IL', '61500': 'IL', '61600': 'IL', '61700': 'IL', '61800': 'IL', '61900': 'IL', '62000': 'IL', '62200': 'IL', '62300': 'IL', '62400': 'IL', '62500': 'IL', '62600': 'IL', '62700': 'IL', '62800': 'IL', '62900': 'IL',
  '46000': 'IN', '46100': 'IN', '46200': 'IN', '46300': 'IN', '46400': 'IN', '46500': 'IN', '46600': 'IN', '46700': 'IN', '46800': 'IN', '46900': 'IN', '47000': 'IN', '47100': 'IN', '47200': 'IN', '47300': 'IN', '47400': 'IN', '47500': 'IN', '47600': 'IN', '47700': 'IN', '47800': 'IN', '47900': 'IN',
  '50000': 'IA', '50100': 'IA', '50200': 'IA', '50300': 'IA', '50400': 'IA', '50500': 'IA', '50600': 'IA', '50700': 'IA', '50800': 'IA', '50900': 'IA', '51000': 'IA', '51100': 'IA', '51200': 'IA', '51300': 'IA', '51400': 'IA', '51500': 'IA', '51600': 'IA', '52000': 'IA', '52100': 'IA', '52200': 'IA', '52300': 'IA', '52400': 'IA', '52500': 'IA', '52600': 'IA', '52700': 'IA', '52800': 'IA',
  '66000': 'KS', '66100': 'KS', '66200': 'KS', '66400': 'KS', '66500': 'KS', '66600': 'KS', '66700': 'KS', '66800': 'KS', '66900': 'KS', '67000': 'KS', '67100': 'KS', '67200': 'KS', '67300': 'KS', '67400': 'KS', '67500': 'KS', '67600': 'KS', '67700': 'KS', '67800': 'KS', '67900': 'KS',
  '40000': 'KY', '40100': 'KY', '40200': 'KY', '40300': 'KY', '40400': 'KY', '40500': 'KY', '40600': 'KY', '40700': 'KY', '40800': 'KY', '40900': 'KY', '41000': 'KY', '41100': 'KY', '41200': 'KY', '41300': 'KY', '41400': 'KY', '41500': 'KY', '41600': 'KY', '41700': 'KY', '41800': 'KY', '42000': 'KY', '42100': 'KY', '42200': 'KY', '42300': 'KY', '42400': 'KY', '42500': 'KY', '42600': 'KY', '42700': 'KY', '42800': 'KY',
  '70000': 'LA', '70100': 'LA', '70300': 'LA', '70400': 'LA', '70500': 'LA', '70600': 'LA', '70700': 'LA', '70800': 'LA', '71000': 'LA', '71100': 'LA', '71200': 'LA', '71300': 'LA', '71400': 'LA', '71500': 'LA',
  '03900': 'ME', '04000': 'ME', '04100': 'ME', '04200': 'ME', '04300': 'ME', '04400': 'ME', '04500': 'ME', '04600': 'ME', '04700': 'ME', '04800': 'ME', '04900': 'ME',
  '20600': 'MD', '20700': 'MD', '20800': 'MD', '20900': 'MD', '21000': 'MD', '21100': 'MD', '21200': 'MD', '21400': 'MD', '21500': 'MD', '21600': 'MD', '21700': 'MD', '21800': 'MD', '21900': 'MD',
  '01000': 'MA', '01100': 'MA', '01200': 'MA', '01300': 'MA', '01400': 'MA', '01500': 'MA', '01600': 'MA', '01700': 'MA', '01800': 'MA', '01900': 'MA', '02000': 'MA', '02100': 'MA', '02200': 'MA', '02300': 'MA', '02400': 'MA', '02500': 'MA', '02600': 'MA', '02700': 'MA',
  '48000': 'MI', '48100': 'MI', '48200': 'MI', '48300': 'MI', '48400': 'MI', '48500': 'MI', '48600': 'MI', '48700': 'MI', '48800': 'MI', '48900': 'MI', '49000': 'MI', '49100': 'MI', '49200': 'MI', '49300': 'MI', '49400': 'MI', '49500': 'MI', '49600': 'MI', '49700': 'MI', '49800': 'MI', '49900': 'MI',
  '55000': 'MN', '55100': 'MN', '55300': 'MN', '55400': 'MN', '55500': 'MN', '55600': 'MN', '55700': 'MN', '55800': 'MN', '55900': 'MN', '56000': 'MN', '56100': 'MN', '56200': 'MN', '56300': 'MN', '56400': 'MN', '56500': 'MN', '56600': 'MN', '56700': 'MN', '56800': 'MN',
  '38600': 'MS', '38700': 'MS', '38800': 'MS', '38900': 'MS', '39000': 'MS', '39100': 'MS', '39200': 'MS', '39300': 'MS', '39400': 'MS', '39500': 'MS', '39600': 'MS', '39700': 'MS',
  '63000': 'MO', '63100': 'MO', '63300': 'MO', '63400': 'MO', '63500': 'MO', '63600': 'MO', '63700': 'MO', '63800': 'MO', '63900': 'MO', '64000': 'MO', '64100': 'MO', '64400': 'MO', '64500': 'MO', '64600': 'MO', '64700': 'MO', '64800': 'MO', '64900': 'MO', '65000': 'MO', '65100': 'MO', '65200': 'MO', '65300': 'MO', '65400': 'MO', '65500': 'MO', '65600': 'MO', '65700': 'MO', '65800': 'MO',
  '59000': 'MT', '59100': 'MT', '59200': 'MT', '59300': 'MT', '59400': 'MT', '59500': 'MT', '59600': 'MT', '59700': 'MT', '59800': 'MT', '59900': 'MT',
  '68000': 'NE', '68100': 'NE', '68300': 'NE', '68400': 'NE', '68500': 'NE', '68600': 'NE', '68700': 'NE', '68800': 'NE', '68900': 'NE', '69000': 'NE', '69100': 'NE', '69200': 'NE', '69300': 'NE',
  '89000': 'NV', '89100': 'NV', '89300': 'NV', '89400': 'NV', '89500': 'NV', '89700': 'NV', '89800': 'NV',
  '03000': 'NH', '03100': 'NH', '03200': 'NH', '03300': 'NH', '03400': 'NH', '03500': 'NH', '03600': 'NH', '03700': 'NH', '03800': 'NH',
  '07000': 'NJ', '07100': 'NJ', '07200': 'NJ', '07300': 'NJ', '07400': 'NJ', '07500': 'NJ', '07600': 'NJ', '07700': 'NJ', '07800': 'NJ', '07900': 'NJ', '08000': 'NJ', '08100': 'NJ', '08200': 'NJ', '08300': 'NJ', '08400': 'NJ', '08500': 'NJ', '08600': 'NJ', '08700': 'NJ', '08800': 'NJ', '08900': 'NJ',
  '87000': 'NM', '87100': 'NM', '87300': 'NM', '87400': 'NM', '87500': 'NM', '87700': 'NM', '87800': 'NM', '87900': 'NM', '88000': 'NM', '88100': 'NM', '88200': 'NM', '88300': 'NM', '88400': 'NM', '88500': 'NM',
  '10000': 'NY', '10100': 'NY', '10200': 'NY', '10300': 'NY', '10400': 'NY', '10500': 'NY', '10600': 'NY', '10700': 'NY', '10800': 'NY', '10900': 'NY', '11000': 'NY', '11100': 'NY', '11200': 'NY', '11300': 'NY', '11400': 'NY', '11500': 'NY', '11600': 'NY', '11700': 'NY', '11800': 'NY', '11900': 'NY', '12000': 'NY', '12100': 'NY', '12200': 'NY', '12300': 'NY', '12400': 'NY', '12500': 'NY', '12600': 'NY', '12700': 'NY', '12800': 'NY', '12900': 'NY', '13000': 'NY', '13100': 'NY', '13200': 'NY', '13300': 'NY', '13400': 'NY', '13500': 'NY', '13600': 'NY', '13700': 'NY', '13800': 'NY', '13900': 'NY', '14000': 'NY', '14100': 'NY', '14200': 'NY', '14300': 'NY', '14400': 'NY', '14500': 'NY', '14600': 'NY', '14700': 'NY', '14800': 'NY', '14900': 'NY',
  '27000': 'NC', '27100': 'NC', '27200': 'NC', '27300': 'NC', '27400': 'NC', '27500': 'NC', '27600': 'NC', '27700': 'NC', '27800': 'NC', '27900': 'NC', '28000': 'NC', '28100': 'NC', '28200': 'NC', '28300': 'NC', '28400': 'NC', '28500': 'NC', '28600': 'NC', '28700': 'NC', '28800': 'NC',
  '58000': 'ND', '58100': 'ND', '58200': 'ND', '58300': 'ND', '58400': 'ND', '58500': 'ND', '58600': 'ND', '58700': 'ND', '58800': 'ND',
  '43000': 'OH', '43100': 'OH', '43200': 'OH', '43300': 'OH', '43400': 'OH', '43500': 'OH', '43600': 'OH', '43700': 'OH', '43800': 'OH', '43900': 'OH', '44000': 'OH', '44100': 'OH', '44200': 'OH', '44300': 'OH', '44400': 'OH', '44500': 'OH', '44600': 'OH', '44700': 'OH', '44800': 'OH', '44900': 'OH', '45000': 'OH', '45100': 'OH', '45200': 'OH', '45300': 'OH', '45400': 'OH', '45500': 'OH', '45600': 'OH', '45700': 'OH', '45800': 'OH', '45900': 'OH',
  '73000': 'OK', '73100': 'OK', '73300': 'OK', '73400': 'OK', '73500': 'OK', '73600': 'OK', '73700': 'OK', '73800': 'OK', '73900': 'OK', '74000': 'OK', '74100': 'OK', '74300': 'OK', '74400': 'OK', '74500': 'OK', '74600': 'OK', '74700': 'OK', '74800': 'OK', '74900': 'OK',
  '97000': 'OR', '97100': 'OR', '97200': 'OR', '97300': 'OR', '97400': 'OR', '97500': 'OR', '97600': 'OR', '97700': 'OR', '97800': 'OR', '97900': 'OR',
  '15000': 'PA', '15100': 'PA', '15200': 'PA', '15300': 'PA', '15400': 'PA', '15500': 'PA', '15600': 'PA', '15700': 'PA', '15800': 'PA', '15900': 'PA', '16000': 'PA', '16100': 'PA', '16200': 'PA', '16300': 'PA', '16400': 'PA', '16500': 'PA', '16600': 'PA', '16700': 'PA', '16800': 'PA', '16900': 'PA', '17000': 'PA', '17100': 'PA', '17200': 'PA', '17300': 'PA', '17400': 'PA', '17500': 'PA', '17600': 'PA', '17700': 'PA', '17800': 'PA', '17900': 'PA', '18000': 'PA', '18100': 'PA', '18200': 'PA', '18300': 'PA', '18400': 'PA', '18500': 'PA', '18600': 'PA', '18700': 'PA', '18800': 'PA', '18900': 'PA', '19000': 'PA', '19100': 'PA', '19300': 'PA', '19400': 'PA', '19500': 'PA',
  '02800': 'RI', '02900': 'RI',
  '29000': 'SC', '29100': 'SC', '29200': 'SC', '29300': 'SC', '29400': 'SC', '29500': 'SC', '29600': 'SC', '29700': 'SC', '29800': 'SC', '29900': 'SC',
  '57000': 'SD', '57100': 'SD', '57200': 'SD', '57300': 'SD', '57400': 'SD', '57500': 'SD', '57600': 'SD', '57700': 'SD', '57800': 'SD',
  '37000': 'TN', '37100': 'TN', '37200': 'TN', '37300': 'TN', '37400': 'TN', '37500': 'TN', '37600': 'TN', '37700': 'TN', '37800': 'TN', '37900': 'TN', '38000': 'TN', '38100': 'TN', '38200': 'TN', '38300': 'TN', '38400': 'TN', '38500': 'TN',
  '75000': 'TX', '75100': 'TX', '75200': 'TX', '75300': 'TX', '75400': 'TX', '75500': 'TX', '75600': 'TX', '75700': 'TX', '75800': 'TX', '75900': 'TX', '76000': 'TX', '76100': 'TX', '76200': 'TX', '76300': 'TX', '76400': 'TX', '76500': 'TX', '76600': 'TX', '76700': 'TX', '76800': 'TX', '76900': 'TX', '77000': 'TX', '77100': 'TX', '77200': 'TX', '77300': 'TX', '77400': 'TX', '77500': 'TX', '77600': 'TX', '77700': 'TX', '77800': 'TX', '77900': 'TX', '78000': 'TX', '78100': 'TX', '78200': 'TX', '78300': 'TX', '78400': 'TX', '78500': 'TX', '78600': 'TX', '78700': 'TX', '78800': 'TX', '78900': 'TX', '79000': 'TX', '79100': 'TX', '79200': 'TX', '79300': 'TX', '79400': 'TX', '79500': 'TX', '79600': 'TX', '79700': 'TX', '79800': 'TX', '79900': 'TX',
  '84000': 'UT', '84100': 'UT', '84300': 'UT', '84400': 'UT', '84500': 'UT', '84600': 'UT', '84700': 'UT', '84800': 'UT',
  '05000': 'VT', '05100': 'VT', '05200': 'VT', '05300': 'VT', '05400': 'VT', '05500': 'VT', '05600': 'VT', '05700': 'VT', '05800': 'VT', '05900': 'VT',
  '20100': 'VA', '22000': 'VA', '22100': 'VA', '22200': 'VA', '22300': 'VA', '22400': 'VA', '22500': 'VA', '22600': 'VA', '22700': 'VA', '22800': 'VA', '22900': 'VA', '23000': 'VA', '23100': 'VA', '23200': 'VA', '23300': 'VA', '23400': 'VA', '23500': 'VA', '23600': 'VA', '23700': 'VA', '23800': 'VA', '23900': 'VA', '24000': 'VA', '24100': 'VA', '24200': 'VA', '24300': 'VA', '24400': 'VA', '24500': 'VA', '24600': 'VA',
  '98000': 'WA', '98100': 'WA', '98200': 'WA', '98300': 'WA', '98400': 'WA', '98500': 'WA', '98600': 'WA', '98800': 'WA', '98900': 'WA', '99000': 'WA', '99100': 'WA', '99200': 'WA', '99300': 'WA', '99400': 'WA',
  '24700': 'WV', '24800': 'WV', '24900': 'WV', '25000': 'WV', '25100': 'WV', '25200': 'WV', '25300': 'WV', '25400': 'WV', '25500': 'WV', '25600': 'WV', '25700': 'WV', '25800': 'WV', '25900': 'WV', '26000': 'WV', '26100': 'WV', '26200': 'WV', '26300': 'WV', '26400': 'WV', '26500': 'WV', '26600': 'WV', '26700': 'WV', '26800': 'WV',
  '53000': 'WI', '53100': 'WI', '53200': 'WI', '53400': 'WI', '53500': 'WI', '53700': 'WI', '53800': 'WI', '53900': 'WI', '54000': 'WI', '54100': 'WI', '54200': 'WI', '54300': 'WI', '54400': 'WI', '54500': 'WI', '54600': 'WI', '54700': 'WI', '54800': 'WI', '54900': 'WI',
  '82000': 'WY', '82100': 'WY', '82200': 'WY', '82300': 'WY', '82400': 'WY', '82500': 'WY', '82600': 'WY', '82700': 'WY', '82800': 'WY', '82900': 'WY', '83000': 'WY', '83100': 'WY'
};

// State name mapping
const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

// Licensing requirements by state
const LICENSING_REQUIREMENTS: Record<string, any> = {
  'CA': { requires_license: true, license_type: 'insurance', notes: 'California requires specific insurance licensing' },
  'NY': { requires_license: true, license_type: 'insurance', notes: 'New York requires insurance licensing' },
  'FL': { requires_license: true, license_type: 'insurance', notes: 'Florida requires insurance licensing' },
  'TX': { requires_license: true, license_type: 'insurance', notes: 'Texas requires insurance licensing' },
  'IL': { requires_license: true, license_type: 'insurance', notes: 'Illinois requires insurance licensing' },
  'PA': { requires_license: true, license_type: 'insurance', notes: 'Pennsylvania requires insurance licensing' },
  'OH': { requires_license: true, license_type: 'insurance', notes: 'Ohio requires insurance licensing' },
  'GA': { requires_license: true, license_type: 'insurance', notes: 'Georgia requires insurance licensing' },
  'NC': { requires_license: true, license_type: 'insurance', notes: 'North Carolina requires insurance licensing' },
  'MI': { requires_license: true, license_type: 'insurance', notes: 'Michigan requires insurance licensing' },
  'NJ': { requires_license: true, license_type: 'insurance', notes: 'New Jersey requires insurance licensing' },
  'VA': { requires_license: true, license_type: 'insurance', notes: 'Virginia requires insurance licensing' },
  'WA': { requires_license: true, license_type: 'insurance', notes: 'Washington requires insurance licensing' },
  'AZ': { requires_license: true, license_type: 'insurance', notes: 'Arizona requires insurance licensing' },
  'MA': { requires_license: true, license_type: 'insurance', notes: 'Massachusetts requires insurance licensing' },
  'TN': { requires_license: true, license_type: 'insurance', notes: 'Tennessee requires insurance licensing' },
  'IN': { requires_license: true, license_type: 'insurance', notes: 'Indiana requires insurance licensing' },
  'MO': { requires_license: true, license_type: 'insurance', notes: 'Missouri requires insurance licensing' },
  'MD': { requires_license: true, license_type: 'insurance', notes: 'Maryland requires insurance licensing' },
  'WI': { requires_license: true, license_type: 'insurance', notes: 'Wisconsin requires insurance licensing' },
  'CO': { requires_license: true, license_type: 'insurance', notes: 'Colorado requires insurance licensing' },
  'MN': { requires_license: true, license_type: 'insurance', notes: 'Minnesota requires insurance licensing' },
  'SC': { requires_license: true, license_type: 'insurance', notes: 'South Carolina requires insurance licensing' },
  'AL': { requires_license: true, license_type: 'insurance', notes: 'Alabama requires insurance licensing' },
  'LA': { requires_license: true, license_type: 'insurance', notes: 'Louisiana requires insurance licensing' },
  'KY': { requires_license: true, license_type: 'insurance', notes: 'Kentucky requires insurance licensing' },
  'OR': { requires_license: true, license_type: 'insurance', notes: 'Oregon requires insurance licensing' },
  'OK': { requires_license: true, license_type: 'insurance', notes: 'Oklahoma requires insurance licensing' },
  'CT': { requires_license: true, license_type: 'insurance', notes: 'Connecticut requires insurance licensing' },
  'UT': { requires_license: true, license_type: 'insurance', notes: 'Utah requires insurance licensing' },
  'IA': { requires_license: true, license_type: 'insurance', notes: 'Iowa requires insurance licensing' },
  'NV': { requires_license: true, license_type: 'insurance', notes: 'Nevada requires insurance licensing' },
  'AR': { requires_license: true, license_type: 'insurance', notes: 'Arkansas requires insurance licensing' },
  'MS': { requires_license: true, license_type: 'insurance', notes: 'Mississippi requires insurance licensing' },
  'KS': { requires_license: true, license_type: 'insurance', notes: 'Kansas requires insurance licensing' },
  'NM': { requires_license: true, license_type: 'insurance', notes: 'New Mexico requires insurance licensing' },
  'NE': { requires_license: true, license_type: 'insurance', notes: 'Nebraska requires insurance licensing' },
  'WV': { requires_license: true, license_type: 'insurance', notes: 'West Virginia requires insurance licensing' },
  'ID': { requires_license: true, license_type: 'insurance', notes: 'Idaho requires insurance licensing' },
  'HI': { requires_license: true, license_type: 'insurance', notes: 'Hawaii requires insurance licensing' },
  'NH': { requires_license: true, license_type: 'insurance', notes: 'New Hampshire requires insurance licensing' },
  'ME': { requires_license: true, license_type: 'insurance', notes: 'Maine requires insurance licensing' },
  'RI': { requires_license: true, license_type: 'insurance', notes: 'Rhode Island requires insurance licensing' },
  'MT': { requires_license: true, license_type: 'insurance', notes: 'Montana requires insurance licensing' },
  'DE': { requires_license: true, license_type: 'insurance', notes: 'Delaware requires insurance licensing' },
  'SD': { requires_license: true, license_type: 'insurance', notes: 'South Dakota requires insurance licensing' },
  'ND': { requires_license: true, license_type: 'insurance', notes: 'North Dakota requires insurance licensing' },
  'AK': { requires_license: true, license_type: 'insurance', notes: 'Alaska requires insurance licensing' },
  'VT': { requires_license: true, license_type: 'insurance', notes: 'Vermont requires insurance licensing' },
  'WY': { requires_license: true, license_type: 'insurance', notes: 'Wyoming requires insurance licensing' }
};

function isValidZipFormat(zipCode: string): boolean {
  const cleanZip = zipCode.replace(/\D/g, '');
  return cleanZip.length === 5 || cleanZip.length === 9;
}

function getStateFromZip(zipCode: string): { state: string; stateName: string } | null {
  const cleanZip = zipCode.replace(/\D/g, '');
  const zipPrefix = cleanZip.substring(0, 5);
  
  // Find the state by checking zip code ranges
  for (const [zipRange, stateCode] of Object.entries(ZIP_TO_STATE)) {
    if (zipPrefix >= zipRange && zipPrefix < (parseInt(zipRange) + 100).toString()) {
      return {
        state: stateCode,
        stateName: STATE_NAMES[stateCode] || stateCode
      };
    }
  }
  
  return null;
}

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function POST(request: NextRequest) {
  try {
    const { zipCode } = await request.json();
    
    if (!zipCode) {
      return createCorsResponse(
        { error: 'Zip code is required' },
        400
      );
    }
    
    // Validate zip code format
    if (!isValidZipFormat(zipCode)) {
      return createCorsResponse(
        { 
          valid: false,
          error: 'Invalid zip code format. Please enter a 5-digit or ZIP+4 format.'
        },
        400
      );
    }
    
    // Get state information
    const stateInfo = getStateFromZip(zipCode);
    
    if (!stateInfo) {
      return createCorsResponse(
        { 
          valid: false,
          error: 'Zip code not found in our database'
        },
        404
      );
    }
    
    // Get licensing requirements
    const licensing = LICENSING_REQUIREMENTS[stateInfo.state] || { 
      requires_license: false, 
      license_type: 'none', 
      notes: 'No special licensing requirements' 
    };
    
    return createCorsResponse({
      valid: true,
      zipCode: zipCode,
      state: stateInfo.state,
      stateName: stateInfo.stateName,
      licensing: licensing,
      timestamp: new Date().toISOString(),
      runtime: 'nextjs'
    });
    
  } catch (error) {
    console.error('Zip code verification error:', error);
    return createCorsResponse(
      { error: 'Internal server error' },
      500
    );
  }
}
