import { Component } from '@angular/core';
import { NFC } from '@ionic-native/nfc/ngx';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nfcReading = false;
  readerModeSub: Subscription;
  intervalSub: Subscription;
  discoveredListenerSub: Subscription;
  nfcTag = '';

  constructor(private nfc: NFC) { }
  startNFC() {
    console.log("startNFC");
    this.nfcReading = true;
    let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;

    this.readerModeSub = this.nfc.readerMode(flags).subscribe(
      tag => {
        console.log(JSON.stringify(tag));
        this.nfcTag = this.nfc.bytesToHexString(tag.id);
        this.nfcReading = false;
        this.readerModeSub.unsubscribe();

      },
      err => {
        console.log("Error reading tag", err);
        this.nfcReading = false;
      }
    );
  }
  startNFCListener() {
    this.nfcReading = true;

    this.discoveredListenerSub = this.nfc.addTagDiscoveredListener(() => {
      console.log('successfully attached addTagDiscoveredListener listener');
    }, (err) => {
      console.log('error attaching addTagDiscoveredListener listener', err);
    }).subscribe((event) => {
      console.log('received addTagDiscoveredListener message. the tag contains: ', event.tag);
      const tag = this.nfc.bytesToHexString(event.tag.id);
      console.log('decoded tag id', tag);
      this.nfcTag = tag;
      this.nfcReading = false;
      this.discoveredListenerSub.unsubscribe();
    });
  }

  doNothing() {
    // this really does nothing... it is just to demonstrate that this triggers the changedetection
  }

  startInterval() {
    this.nfcReading = true;
    this.intervalSub = interval(2000).subscribe((_) => {
      this.nfcTag = 'interval Tag';
      this.nfcReading = false;
      this.intervalSub.unsubscribe();
    });
  }


}
