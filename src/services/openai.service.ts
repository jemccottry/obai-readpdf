import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '../config/config.service';
import * as fs from 'fs';


@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.openAIKey,
    });
  }


  async queryOpenAI(extractedText: string): Promise<any> {
    const prompt = `
      Here is the extracted text from the PDF: 
      ${extractedText}
      
      Based on the information in the text above, please extract the following 13 items:
      1. Name of the adjustment company
      2. Insurance policy number
      3. Client's name
      4. Contact information (phone number, email, etc.)
      5. Address of the company
      6. Claim number
      7. Date of the claim
      8. Type of insurance
      9. Payment information (if any)
      10. Description of the incident
      11. Amount claimed
      12. Any other relevant details

      Please provide these details in this format strict type

      {
  "adjustmentCompany": "",
  "insuranceCompany": "",
  "claimNumber": "",
  "insurancePolicyNumber": "",
   "client": {
    "business_name": "",
    "first_name": "",
    "last_name": "",
    "contact_information": {
      "phone_number": "",
      "email": "",
      "address": "",
      "city": "",
      "state": "",
      "zip": ""
    }
  },
  "vehicleInformation": {
    "year": "",
    "make": "",
    "model": "",
    "vin": "",
    "licensePlate": "",
    "color": "",
    "mileage": ""
  },
  "locationInformation": {
    "locationDescription": "",
    "address": "",
    "city": "",
    "state": "",
    "zip": "",
    "phone": ""
  },
  "dateOfClaim": "",
  "typeOfInsurance": ""
}

if you dont have one of these elements, leave it blank, but do your best to find the elements if they are in the correct context

Note the adjustment comppany and the insurance company are different and so if you find one make sure you look for the other. Lastly i dont need any other response except you the json object
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', 
        messages: [
          { role: 'user', content: prompt},
        ],
      });
      //console.log(response.usage?.total_tokens);
      const promptresponse = response.choices[0].message
          //var fixedresponse = promptresponse.content.replace(/```json\n?|```/g, '');
      
      return promptresponse.content
    } catch (error) {
      console.error('Error interacting with OpenAI:', error);
      throw error;
    }
  }
}