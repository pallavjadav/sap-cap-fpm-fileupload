using from '@sap/cds/srv/outbox';

service OutboxDeadLetterQueueService {

    @readonly
    entity DeadOutboxMessages as projection on cds.outbox.Messages
        actions {
            action revive();
            action deleteQueue();
        };

}