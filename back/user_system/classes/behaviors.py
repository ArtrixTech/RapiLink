class Behavior:
    Administrator = True
    CommonUser = True
    VipUser = True
    UnregisteredUser = True

    def to_json(self):
        import json
        return json.dumps({"Administrator": self.Administrator, "CommonUser": self.CommonUser, "VipUser": self.VipUser,
                           "UnregisteredUser": self.UnregisteredUser})


class Behaviors:
    class AddLink(Behavior):
        UnregisteredUser = False
        pass


def get_behavior_by_name(name):
    if name == "AddLink":
        return Behaviors.AddLink()
