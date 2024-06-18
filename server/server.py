from flask import Flask, request
import handle
import functools
app = Flask(__name__)


def auth_required(admin_level=False, change_marks=False, change_sites=False, change_nets=False, delete_history=False):

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            auth = request.json['auth']
            # time.sleep(1)
            values = handle.valid_auth(auth, admin_level, change_marks, change_sites, change_nets, delete_history)
            is_valid, is_admin, can_change_marks, can_change_sites, can_change_nets, can_delete_history = values
            if is_valid:
                return func(*args, **kwargs,
                            is_admin=is_admin,
                            can_change_marks=can_change_marks,
                            can_change_sites=can_change_sites,
                            can_delete_history=can_delete_history,
                            can_change_nets=can_change_nets)
            return handle.auth_failed()

        return wrapper

    return decorator


@app.route('/api/login', methods=["POST"])
def login():
    return handle.login(request.json['auth'])


@app.route("/api/getPakal", methods=["POST"])
@auth_required()
def get_pakal(**_kwargs):
    return handle.get_pakal(request.json['body'], request.json['auth'])


@app.route("/api/setPakal", methods=["POST"])
@auth_required()
def set_pakal(can_change_marks, can_change_sites, can_change_nets, **_kwargs):
    return handle.set_pakal(request.json['body'],
                            request.json['auth'],
                            can_change_marks,
                            can_change_sites,
                            can_change_nets)


@app.route("/api/getHistory", methods=["POST"])
@auth_required()
def get_history(**_kwargs):
    return handle.get_history(request.json['body'])


@app.route("/api/getRecord/<string:record>", methods=["POST"])
@auth_required()
def get_record(record, **_kwargs):
    return handle.get_record(request.json['body'], request.json['auth'], record)


@app.route("/api/removeRecord", methods=["POST"])
@auth_required(delete_history=True)
def remove_record(**_kwargs):
    return handle.remove_record(request.json['body'])


@app.route("/api/removeTimeRange", methods=["POST"])
@auth_required(delete_history=True)
def remove_time_range(**_kwargs):
    return handle.remove_time_range(request.json['body'])


@app.route("/api/getPermissionsData", methods=["POST"])
@auth_required(admin_level=True)
def get_permissions_info(**_kwargs):
    return handle.get_permissions_info(request.json['body'])


@app.route("/api/setPermissionsData", methods=["POST"])
@auth_required(admin_level=True)
def set_permissions_info(**_kwargs):
    return handle.set_permissions_info(request.json['body'])


@app.route("/api/getUsersData", methods=["POST"])
@auth_required(admin_level=True)
def get_users_info(**_kwargs):
    return handle.get_users_info(request.json['body'])


@app.route("/api/setUsersData", methods=["POST"])
@auth_required(admin_level=True)
def set_users_info(**_kwargs):
    return handle.set_users_info(request.json['body'])


@app.route("/api/resetPassword", methods=["POST"])
@auth_required(admin_level=True)
def reset_user_password(**_kwargs):
    return handle.reset_user_password(request.json['body'])


@app.route('/api/setPassword', methods=["POST"])
@auth_required()
def set_password(**_kwargs):
    return handle.set_password(request.json['body'])


if __name__ == "__main__":
    handle.create_dependencies()
    try:
        app.run(debug=True)
    finally:
        handle.close()
