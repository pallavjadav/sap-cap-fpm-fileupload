using OutboxDeadLetterQueueService as service from '../../srv/outbox-dead-letter-queue-service';
annotate service.DeadOutboxMessages with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'timestamp',
                Value : timestamp,
            },
            {
                $Type : 'UI.DataField',
                Label : 'target',
                Value : target,
            },
            {
                $Type : 'UI.DataField',
                Label : 'msg',
                Value : msg,
            },
            {
                $Type : 'UI.DataField',
                Label : 'attempts',
                Value : attempts,
            },
            {
                $Type : 'UI.DataField',
                Label : 'partition',
                Value : partition,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastError',
                Value : lastError,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastAttemptTimestamp',
                Value : lastAttemptTimestamp,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'task',
                Value : task,
            },
            {
                $Type : 'UI.DataField',
                Label : 'appid',
                Value : appid,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'timestamp',
            Value : timestamp,
        },
        {
            $Type : 'UI.DataField',
            Label : 'target',
            Value : target,
        },
        {
            $Type : 'UI.DataField',
            Label : 'msg',
            Value : msg,
        },
        {
            $Type : 'UI.DataField',
            Label : 'attempts',
            Value : attempts,
        },
        {
            $Type : 'UI.DataField',
            Label : 'partition',
            Value : partition,
        },
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : appid,
            Label : 'appid',
        },
        {
            $Type : 'UI.DataField',
            Value : lastAttemptTimestamp,
            Label : 'lastAttemptTimestamp',
        },
        {
            $Type : 'UI.DataField',
            Value : lastError,
            Label : 'lastError',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'status',
        },
        {
            $Type : 'UI.DataField',
            Value : task,
            Label : 'task',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'OutboxDeadLetterQueueService.delete',
            Label : 'delete',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'OutboxDeadLetterQueueService.revive',
            Label : 'revive',
        },
    ],
);

