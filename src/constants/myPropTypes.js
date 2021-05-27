import PropTypes from 'prop-types';

export const ImportMapPropType = PropTypes.shape({
    id: PropTypes.number,
    MapField: PropTypes.string,
    CSVField: PropTypes.string,
    CustomerValue: PropTypes.string,
    MappedValue: PropTypes.string,
    MappedOptions: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
});

