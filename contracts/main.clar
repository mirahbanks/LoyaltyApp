;; Define the contract
(define-trait sip-010-trait
  (
    (transfer (principal principal uint) (response bool uint))
    (get-name () (response (string-ascii 32) uint))
    (get-symbol () (response (string-ascii 32) uint))
    (get-decimals () (response uint uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
  )
)

(impl-trait .sip-010-trait.sip-010-trait)

(define-fungible-token loyalty-token)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

(define-map user-activity principal uint)
(define-map items uint {name: (string-ascii 64), price: uint, is-available: bool})
(define-data-var item-count uint u0)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? loyalty-token amount sender recipient))
    (ok true)
  )
)

(define-read-only (get-name)
  (ok "LoyaltyToken")
)

(define-read-only (get-symbol)
  (ok "LTK")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance loyalty-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply loyalty-token))
)

(define-public (earn-tokens (user principal) (activity-points uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (try! (ft-mint? loyalty-token (* activity-points u1000000) user))
    (map-set user-activity user (+ (default-to u0 (map-get? user-activity user)) activity-points))
    (ok true)
  )
)

