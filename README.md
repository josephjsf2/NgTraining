
# 學習目標：
1. 熟悉 Typescript 語法，只需學習常用語法即可

2. Angular
	* Component
	* Service
	* Module
	* Routing
	* Directive
	* HttpClient
	* ReactiveForm
	* Pipe

3. Rxjs
	* 建立Observable
	    * of
	    * from
    * Subject
        * Sbuject
        * BehaviorSubject
	* 常用Operator: 
		* tap
		* map
		* filter
		* catchError
		* switchMap
		* concatMap
		* mergeMap
4. 專案中API介接方式

# 專案練習
* 不考慮IE
* 不考慮 RWD
* 沒有提到的功能可以不實做
* 有疑問的項目不實做，等確定後才實做
* 建議介接任何API，必先以postman或是 curl等工具測試過，確定沒問題後再使用程式執行

## 基本練習 -
CSS Framework: Bootstrap 5
### 1. 登入頁 - 需要在登入後從API取得 authToken資訊
* 使用ReactiveForm實做 
* 登入失敗時，需顯示錯誤訊息
* 當欄未被使用者點 touch 過且未輸入資料時，需要在欄位下方顯示『XX欄位不可留空』
* 只要輸入欄位未輸入完整資料，則登入按鈕不可被點擊
* 輸入完密碼後，實做 peek 功能，讓使用者可以看到自己輸入的密碼
* 需防止使用者 Double click登入按鈕
* 登入成功後，將畫面重導至會員帳號清單功能(/pages/member)
* 只要使用者未登入，統一將瀏覽器重導回登入頁
* 若使用者已登入過，則不再進入登入畫面(透過瀏覽器連結觸發)，統一導至 /pages/member

### 2. 會員帳號清單 - 呈現系統上人員資料(/pages/member)
* 上方提供查詢欄位，以帳號、姓名、卡號、Email查詢
* 點選列表上帳號可將畫面重導到帳號編輯維護畫面(/pages/member/eidt/:id)
* 完成分頁功能，於每頁資料筆數與頁碼變換時重新抓取資料
* 點擊『新增』按鈕後，將畫面重導至新增帳號畫面(/pages/member/new)
* 會員狀態(status)目前以 Y/N/D 顯示，在呈現時，調整為
    - Y：啟用
    - N:停用
    - D:註銷
* 嘗試將分頁頁籤、筆數設定與總筆數功能畫面設計為一個獨立的component，並用於member-list component。
* 嘗試於查詢時加入loading/ spinner效果。

### 3. 帳號維護 - 維護已存在之帳號(/pages/member/edit/:id)
* 使用ReactiveForm實做
* 提供基本資料維護功能，
    * 可編輯項目：
        * 姓名(必填)
        * 狀態(必填)
        * Email(必填)
        * 電話
        * 卡號
    * 不可編輯
        * 帳號
        * 建立日期
        * 修改日期
        * 密碼變更日期
* 需要驗證項目(搭配查詢API，***實做前必須充分瞭解part 2中 API使用方法***)：
    * 欄位是否必填
    * 使用者輸入當下同時檢查Email不可與系統中其他帳號重複
    * Email格式是否正確
* 只要欄位被touch過且驗證不符合，即在欄位下方提示錯誤
    * 此欄位為必填欄位
    * Email格式錯誤
    * Email不可與其他使用者重複
* 送出儲存請求後，需提示成功與失敗，並於儲存成功後將畫面導向帳號清單畫面
* 畫面上提供刪除功能，刪除前需要詢問使用者是否確定要刪除，使用者點擊確定後才可真正刪除
* 提供重設密碼按鈕，點擊後顯示提供重設密碼介面
    * 提供密碼欄位與確認密碼欄位
    * 提供 peek 功能
    * 密碼複雜度，需滿足『大寫英文』、『小寫英文』、『數字』與『特殊符號』其中三種才算合法密碼
* 資料送出至後端過程等待時間，顯示loading/ spinner


### 4. 帳號新增(/pages/member/new)
* 以Reactive Form實做新增功能
* 新增畫面上，提供下列欄位輸入
    * 帳號(必填、檢查是否重複)
    * 密碼(必填、需驗證複雜度、可使用peek)
    * 確認密碼
    * 姓名(必填)
    * 狀態(必填)
    * Email(必填、使用者輸入當下同時檢查是否重複、是否為合法Email格式)
    * 電話
    * 卡號
* 新增成功後，返回列表頁，失敗時需要提示使用者新增失敗，並保留資料
* 抓資料或更新資料時，嘗試加入 loading或是有助於改善UX之效果。


### 5. 公告模組(/pages/announcement/*)
* 畫面自行設計不限制，需要之功能：
    * 需要公告列表
    * 單筆資料檢視功能
    * 提供標題與內文查詢
    * 提供分頁功能
    * 列表上呈現有效日期資訊(yyyy/MM/dd hh:mm:ss)

## 進皆練習
### 新聞資料API介接(/pages/news)
CSS Framework：[Bulma](https://bulma.io/)
API網站： https://newsapi.org/docs/endpoints/top-headlines
* apiKey: API Key
* country: 國家代碼
* category: 類別
* q: 關鍵字
* pageSize: 筆數

實做功能：
1. 國家切換功能：
    * 連動切換文章列表內容
    * 記錄目前選擇國家資訊，下次進入時帶出選擇的國家，預設為us
2. Main: 
    * 預設為 Business類別
    * 切換時，連動切換文章列表內容
3. NewsList:
    * 從API抓取新聞資料
    * 可使用關鍵字查詢，當使用者輸入完停滯 1 秒後，即送出查詢抓取新聞資料，並呈現於畫面
    * 每次抓完資料後，預設呈現第一筆新聞，同時連動右側新聞內容資料
    * 目前被選擇到的新聞，需以顏色標示
    * 開發前，先測試API是否可行，每組API KEY有次數限制，可從最後的列表中取得其他API KEY切換：https://newsapi.org/v2/top-headlines?country=us&category=general&q=&apiKey=5c272dc78f954b94855e059b7e2dabc2&pageSize=100
4.  NewsContent
    * 顯示目前NewsList上被選擇到的內容，若無內容，則顯示無資料
    * 顯示新聞發佈時間為 N seconds ago/ N minutes ago/ N hours ago... etc.
    * 可選擇前一筆與下一筆，會連動NewsList目前選擇到的資料往前或往後一筆


### API KEY List:
* 87766146f8c44bc5abf6e30f19557a39
* b73772ea993b4ac686aea7ccfd29a60f
* da6264ab02ac4209aa6f571a5796156d
* c1b17b93430c4b5db260c2f9292439f6
* 373d6941579a44968e4e75665e6a2ebd
* f3a45eeca2154c3984de5e85b65e46b4
* 2ba2934ab6ee40c79f68dac51c9d8524
* 1cce5b28383240c9b9a2600c163e66e2
* 19d534dc985b4b5383ff6e1313765aab
* de1019e54bb045408cfbc5c5d21e1d59
* b074733a290641fdaff52e08c34c03f6
* 49dfc7ea47554e89b1bd5bfe5140024d
* 5fc4dc6e50ec47dcae93a62fe366a663

