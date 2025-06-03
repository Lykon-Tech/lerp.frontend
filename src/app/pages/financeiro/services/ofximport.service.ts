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
    const content = ofxContent.replace(/\r\n/g, '').replace(/\n/g, '').replace(/>\s+</g, '><');

    const getTagValue = (source: string, tag: string): string => {
        const xmlMatch = source.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`, 's'));
        if (xmlMatch) return xmlMatch[1].trim();

        const sgmlMatch = source.match(new RegExp(`<${tag}>([^<\\r\\n]+)`));
        return sgmlMatch ? sgmlMatch[1].trim() : '';
    };

    const numeroBanco = getTagValue(content, 'BANKID')
    const agencia = getTagValue(content, 'BRANCHID');
    const numeroConta = getTagValue(content, 'ACCTID');

    const transactionMatches = content.match(/<STMTTRN>.*?<\/STMTTRN>/gs) || [];

    return transactionMatches.map(trn => {
        const dtPosted = getTagValue(trn, 'DTPOSTED');
        let date: Date;
        if (dtPosted.length >= 8) {
            const year = parseInt(dtPosted.substring(0, 4));
            const month = parseInt(dtPosted.substring(4, 6)) - 1;
            const day = parseInt(dtPosted.substring(6, 8));
            date = new Date(year, month, day);
        } else {
            date = new Date();
        }

        const amount = parseFloat(getTagValue(trn, 'TRNAMT')) || 0;
        const historico = getTagValue(trn, 'MEMO');

        return {
            dataLancamento: date,
            valor: amount,
            historico: historico,
            numeroDocumento: getTagValue(trn, 'CHECKNUM') || getTagValue(trn, 'FITID'),
            tag: historico,
            numeroBanco : numeroBanco,
            agencia: agencia,
            numeroConta: numeroConta
        };
    });
  }

}