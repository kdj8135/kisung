export const pmsConfig: any = {
  PMS_API_URL: "",

  //DB 정보-----start
  //테스트및 개발
  Protocol: "http",
  //Hostname: "localhost",
  Hostname: "www.collabra.co.kr",

  //운영
  // Hostname: "192.168.1.77",

  Port: "8088",
  //DB 정보-----end

  defaultLocale: "kr",
  defaultLocaleLcid: 1042,
  languages: [
    {
      "key": "us",
      "lcid": 1033,
      "alt": "United States",
      "title": "English (US)"
    },
    {
      "key": "kr",
      "lcid": 1042,
      "alt": "Korea",
      "title": "한국어"
    }
  ],
  User_joblist: [
    {
      //사용 유무 Y = 사용, N = display:none;
      "P": "N", //직위
      "D": "N", //직무
      "T": "Y", //직책
      "R": "Y", //직급
      "O": "Y"  //직군
    }
  ]
};
