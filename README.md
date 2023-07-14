# NativeトークンTransfer
## 設定値
- deployer:トークンの送信者
- recieverList:トークンの受取者の一覧配列
- sendAmount:配布する数量
- wsProvider:NetworkのRPCのURL
## 特記
- 当該アプリはSbustrate系ブロックチェーンのネイティブトークン送信用です。
- テストでは、ALICE_STASH、BOB_STASHアドレスに送信するように実装してあります。
- Decimal18の前提で１単位送信するように実装してあります。
- 設定変更が必要な箇所には「todo:」としてコメントしてあります。
- deployer設定には、送信対象者の秘密鍵（ニーモニックではない）を設定して下さい。
# 必ずご自身でテストをして、ご自身の責任で実行して下さい。作成者は何の保証も対応も出来ません。