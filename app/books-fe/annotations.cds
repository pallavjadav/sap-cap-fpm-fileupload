using MyBooks as service from '../../srv/service';
using from '../../db/schema';

annotate service.Books with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
            },
            {
                $Type : 'UI.DataField',
                Value : Title,
            },
            {
                $Type : 'UI.DataField',
                Value : Author,
            },
            {
                $Type : 'UI.DataField',
                Value : Genre,
            },
            {
                $Type : 'UI.DataField',
                Value : Price,
            },
            {
                $Type : 'UI.DataField',
                Value : currentlyAvailableStatus_code
            }
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
            Value : Title,
        },
        {
            $Type : 'UI.DataField',
            Value : ID,
        },
        {
            $Type : 'UI.DataField',
            Value : Author,
        },
        {
            $Type : 'UI.DataField',
            Value : Genre,
        },
        {
            $Type : 'UI.DataField',
            Value : Price,
        },
    ],
);
