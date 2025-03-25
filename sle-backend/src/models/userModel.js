// models/UserModel.js
class UserModel {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.mobile = user.mobile;
    this.password = user.password;
    this.userType = user.userType;
    this.isManager = user.isManager || 0; // Add isManager and default it to 0 (not a manager)
  }
}
export default UserModel;
