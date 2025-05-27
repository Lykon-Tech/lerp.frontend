import { Injectable } from '@angular/core';
import { ImportacaoOfx } from '../models/ofximport.model';

@Injectable({
  providedIn: 'root'
})
export class OfxImportService {

  constructor() { }

  async importarOfx(file: File): Promise<ImportacaoOfx[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const ofxContent = event.target?.result as string;
          const transactions = this.parseOfx(ofxContent);
          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file);
    });
  }

    private parseOfx(ofxContent: string): ImportacaoOfx[] {
        const content = ofxContent.replace(/\r\n/g, '').replace(/>\s+</g, '><');
        const getHeaderTagValue = (tag: string): string => {
            const match = content.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
            return match ? match[1] : '';
        };

        const agencia = getHeaderTagValue('BANKID');
        const numeroConta = getHeaderTagValue('ACCTID');

        const transactionMatches = content.match(/<STMTTRN>.*?<\/STMTTRN>/g) || [];

        return transactionMatches.map(trn => {
            const getTagValue = (tag: string) => {
            const match = trn.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
            return match ? match[1] : '';
            };

            const dtPosted = getTagValue('DTPOSTED');
            let date: Date;
            if (dtPosted.length >= 8) {
            const year = parseInt(dtPosted.substring(0, 4));
            const month = parseInt(dtPosted.substring(4, 6)) - 1;
            const day = parseInt(dtPosted.substring(6, 8));
            date = new Date(year, month, day);
            } else {
            date = new Date();
            }

            const amount = Math.abs(parseFloat(getTagValue('TRNAMT'))) || 0;
            const historico = getTagValue('MEMO');

            return {
            dataLancamento: date,
            valor: amount,
            historico: historico,
            numeroDocumento: getTagValue('CHECKNUM') || getTagValue('FITID'),
            tag: historico,
            agencia: agencia,
            numeroConta: numeroConta
            };
        });
    }

}