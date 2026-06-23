# SAP CAP Persistent Queue / Outbox - Complete Reference

## Problem Statement

Consider a scenario where an application performs:

1. Database update
2. External API call

Example:

```js
await INSERT.into(Books).entries(entries)

await externalService.send({
  fileName: 'Books.xlsx'
})
```

This approach has a major issue:

### Scenario 1

```text
DB Insert     SUCCESS
API Call      FAIL
```

Result:

```text
Database contains data
External system is not updated
```

### Scenario 2

```text
API Call      SUCCESS
DB Commit     FAIL
```

Result:

```text
External system updated
Database rollback
```

Resulting in inconsistent state.

Since CAP transactions only cover the database, CAP cannot provide a distributed transaction across:

```text
CAP Database
+
REST API
+
S4 System
+
SuccessFactors
+
Third Party API
```

---

# CAP Solution: Persistent Queue (Outbox)

Instead of executing the remote call immediately:

```js
const outboxService = cds.queued(
  await cds.connect.to('OutboxTestService')
)

await outboxService.simulateRemoteCall({
  fileName: 'Books.xlsx',
  recordCount: entries.length
})
```

CAP stores the request in:

```text
cds.outbox.Messages
```

inside the same database transaction.

Flow:

```text
INSERT Books
      ↓
Create Outbox Message
      ↓
Commit Transaction
      ↓
Request Returns Success
      ↓
Background Worker Executes Remote Call
```

---

# Example

## Service Definition

```cds
service OutboxTestService {

  action simulateRemoteCall(
      fileName : String,
      recordCount : Integer
  );

}
```

## Service Implementation

```js
module.exports = cds.service.impl(function () {

  this.on('simulateRemoteCall', async req => {

      console.log('REMOTE CALL EXECUTED')

      throw new Error('Simulated Failure')

  })

})
```

## Upload Handler

```js
await INSERT.into(Books).entries(entries)

const outboxService = cds.queued(
    await cds.connect.to('OutboxTestService')
)

await outboxService.simulateRemoteCall({
    fileName: 'Books.xlsx',
    recordCount: entries.length
})
```

---

# What Happens When Remote Call Fails?

```text
INSERT Books               SUCCESS
Create Outbox Message      SUCCESS
COMMIT                     SUCCESS
Remote Call                FAIL
```

Result:

```text
Books table contains data
Outbox message remains pending
CAP retries automatically
```

No rollback occurs because the transaction has already committed.

---

# What Happens When Transaction Fails?

Example:

```js
await INSERT.into(Books).entries(entries)

await outboxService.simulateRemoteCall(...)

throw new Error('Rollback')
```

Flow:

```text
INSERT Books
Create Outbox Message
Exception
ROLLBACK
```

Result:

```text
Books not inserted
Outbox message removed
Remote call never executed
```

This is the primary guarantee provided by the Outbox pattern.

---

# Retry Mechanism

CAP Persistent Queue automatically retries failed messages.

The implementation uses exponential backoff.

CAP source code:

```js
function expBkfRnd(x) {
  return x > 18
    ? 1480000
    : (Math.pow(1.5, x) + Math.random()) * 1000
}
```

Retry delay:

| Attempt | Delay       |
| ------- | ----------- |
| 1       | 0.5 sec     |
| 2       | 1.25 sec    |
| 3       | 2.38 sec    |
| 4       | 4.06 sec    |
| 5       | 6.59 sec    |
| 6       | 10.39 sec   |
| 7       | 16.09 sec   |
| 8       | 24.63 sec   |
| 9       | 37.44 sec   |
| 10      | 56.67 sec   |
| 11      | 85.50 sec   |
| 12      | 128.75 sec  |
| 13      | 193.62 sec  |
| 14      | 291.93 sec  |
| 15      | 437.89 sec  |
| 16      | 656.84 sec  |
| 17      | 985.26 sec  |
| 18      | 1477.89 sec |

Maximum retry delay:

```text
24.67 minutes
```

---

# Queue Configuration

Example:

```json
{
  "cds": {
    "requires": {
      "queue": {
        "kind": "persistent-queue",
        "maxAttempts": 10,
        "storeLastError": true,
        "legacyLocking": false,
        "timeout": "1h"
      }
    }
  }
}
```

Meaning:

### maxAttempts

Maximum retry count.

```text
After maxAttempts
Message becomes dead letter
```

### storeLastError

Stores the last failure reason in the outbox table.

### timeout

Used when a worker crashes while processing a message.

After timeout expires:

```text
Message becomes eligible again
```

### legacyLocking

Controls old vs new locking strategy.

For CAP 9+, typically:

```json
"legacyLocking": false
```

is preferred.

---

# Dead Letter Messages

When retries exceed maxAttempts:

```text
attempts >= maxAttempts
```

CAP stops retrying.

Message remains in:

```text
cds.outbox.Messages
```

Example:

```text
ATTEMPTS = 10
STATUS = error
LASTERROR = Connection timeout
```

---

# Revive Action

A revive action usually resets:

```js
await UPDATE('cds.outbox.Messages')
  .set({
      attempts: 0
  })
```

Effect:

```text
Dead Letter
      ↓
Revive
      ↓
Eligible For Processing Again
```

Revive does not execute the message itself.

It only allows CAP to process it again.

---

# Long Running Tasks

Outbox is ideal for:

```text
Generate PDF
Upload to DMS
Call S4
Call CPI
Send Email
Large Data Synchronization
```

Example:

```js
this.on('longRunningProcess', async req => {

    await new Promise(resolve =>
        setTimeout(resolve, 60000)
    )

})
```

Without Outbox:

```text
User waits 60 seconds
```

With Outbox:

```text
User receives immediate response
Background processing continues
```

---

# When To Use Outbox

Use Outbox when:

```text
Database is source of truth
External call can be retried
Eventual consistency is acceptable
```

Examples:

```text
S4 Integration
SuccessFactors Integration
CPI Integration
Email Notifications
Document Management Upload
Background Processing
```

---

# When Not To Use Outbox

Do not use Outbox when:

```text
Remote system must succeed before DB commit
```

Example:

```text
Payment Authorization
Bank Transfer
Credit Card Charge
```

In such cases, use synchronous processing or Saga/Compensation patterns.

---

# Key Takeaway

Outbox guarantees:

```text
DB Rollback
    =>
No Remote Call

DB Commit
    =>
Remote Call Eventually Happens
```

It does NOT guarantee:

```text
Remote Success
    =>
DB Commit

or

DB Commit
    =>
Remote Success Immediately
```

It guarantees eventual execution through persistence and retries.
