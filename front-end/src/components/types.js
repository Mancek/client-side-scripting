import PropTypes from 'prop-types';

export const CellWithReferenceProps = {
  endpoint: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  render: PropTypes.func.isRequired
};

export const EntityTableProps = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  formFields: PropTypes.node.isRequired,
  onRow: PropTypes.func,
  form: PropTypes.object,
  onEdit: PropTypes.func,
  defaultFilters: PropTypes.object,
  transformSubmitData: PropTypes.func,
  onAfterSubmit: PropTypes.func
};

export const AvatarUploadProps = {
  avatarUrl: PropTypes.string,
  onAvatarChange: PropTypes.func.isRequired
};

export const ProtectedRouteProps = {
  children: PropTypes.node.isRequired
};