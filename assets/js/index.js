$(function () {
    getUserInfo()

    let layer = layui.layer
    $('#btnLogout').click(function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, index => {
            // 1. 清空本地存储中的token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录界面
            location.href = '/login.html'
            // 3. 关闭弹出框
            layer.close(index)
        })
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: res => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar()方法渲染用户的头像
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
    if (user.user_pic !== null) {
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
    } else {
        let firstWord = name[0].toUpperCase()
        $('.text-avatar')
            .html(firstWord)
            .addClass('text-avatar-show')
    }
}