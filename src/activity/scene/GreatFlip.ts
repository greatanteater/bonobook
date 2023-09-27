import axios from "axios";

interface Json {
  imagesCount: number;
  sync: number[];
}

interface CurrentDate {
  year: number;
  month: number;
  day: number;
}

export default class GreatFlip {
  private _jsonData: Json | null = null;
  private pages: string[] = [];
  private bookNumber = 0;
  public commonPath: string;
  public audio: HTMLAudioElement | null = null;
  private rustlingAudio: HTMLAudioElement | null = null;
  public sync: number[] = [];
  public currentDate: CurrentDate | null = null;

  constructor() {
    this.commonPath = `${process.env.BASE_URL}common`;
    this.setDate();
  }

  public setDate() {
    const startDate = new Date(2023, 8, 27);
    const today = new Date();
    const msPerDay = 24 * 60 * 60 *1000;
    const daysSince = Math.floor((today.getTime() - startDate.getTime()) / msPerDay) + 1;

    if (daysSince <= 1) {
      this.bookNumber = 1;
    } else {
      // this.bookNumber = daysSince;
      this.bookNumber = 1;
    }

    this.currentDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    }
    console.log(`오늘 날짜: ${this.currentDate.year}년 ${this.currentDate.month}월 ${this.currentDate.day}일`);
    console.log(`"경과일: ${daysSince}"`);
    console.log(`"book ${daysSince}"`);
  }

  public async init() {
    await this.getJson();
    if (this._jsonData) {
      const pagesCount = this._jsonData.imagesCount * 2 - 2;
      for (let i = 1; i < pagesCount + 1; i++) {
        if (i == 1) {
          this.pages.push('');
        }
        const path = `${process.env.BASE_URL}book${this.bookNumber}/${i}.png`;
        this.pages.push(path);
      }
    }
    this.setSound();
  }

  private mutateJsonData(jsonData: Json) {
    this._jsonData = jsonData;
    this.sync = jsonData.sync;
  }

  private async getJson() {
    const path = `${process.env.BASE_URL}book${this.bookNumber}/bookdata.json`;
    try {
      const response = await axios.get(path);
      this.mutateJsonData(response.data);
      this.lastPage();
    } catch (reason) {
      console.log(reason);
    }
  }

  private async lastPage() {
    if (this._jsonData !== null) {
      console.log("마지막 이미지: " + this._jsonData.imagesCount);
    } else {
      console.log("JSON 데이터가 없습니다.");
    }
  }

  private setSound() {
    const path = `${process.env.BASE_URL}book${this.bookNumber}/sound.mp3`;
    const rustlingPath = `${process.env.BASE_URL}common/rustling.wav`;

    this.audio = new Audio(path);
    this.rustlingAudio = new Audio(rustlingPath);

    console.log('"사운드 로드 완료"');
  }

  public clearSound() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
    }
    if (this.rustlingAudio) {
      this.rustlingAudio.pause();
      this.rustlingAudio.src = '';
      this.rustlingAudio.load();
      this.rustlingAudio = null;
    }
  }

  public playSound() {
    if (this.audio != null) {
      this.audio.play().catch(error => {
        console.error("Failed to play audio:", error);
      });
    }
  }

  public stopSound() {
    if (this.audio != null) {
      this.audio.pause();
    }
  }

  public moveSound(sync: number) {
    if (this.audio != null) {
      if (sync > this.sync.length - 1) {
        this.stopSound();
        console.log('"마지막 이미지이삼"');
      } else {
        this.audio.currentTime = this.sync[sync];
        if (this.audio.paused) {
          this.playSound();
        }
      }
    }
  }

  public rustilingSoundPlay() {
    if (this.rustlingAudio) {
      this.rustlingAudio.currentTime = 0;
      this.rustlingAudio.play();
    }
  }

  public getPages() {
    console.log('"이미지 경로 로드 완료"');
    return this.pages;
  }
}
