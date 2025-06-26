export const useCheckPermissions = jest.fn(() => ({
  checkPermissions: jest.fn().mockResolvedValue(true),
}));

export default {
  useCheckPermissions,
};
