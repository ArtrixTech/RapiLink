def add_user():
    """
    - Add a user to the database with permission
    :return: [0](str)Status Code, "OK" -> Ok
    """
    username = request.args.get("username")
    permission_text = request.args.get("permission")
    permission = Permission.CommonUser

    if permission_text.lower() == "administrator":
        permission = Permission.Administrator

    if permission_text.lower() == "unregistereduser":
        permission = Permission.UnregisteredUser

    if permission_text.lower() == "vipuser":
        permission = Permission.VipUser

    if permission_text.lower() == "commonuser":
        permission = Permission.CommonUser

    print(type(permission))

    user_manager.add(User(username, permission))
    return "OK"