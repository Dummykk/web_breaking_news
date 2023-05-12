$(function () {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: value => {
            if (value === $('input[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: value => {
            if (value !== $('input[name=newPwd]').val()) {
                return '两次输入的密码不一致！'
            }
        }
    })

    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                // 重置表单
                this.reset()
            }
        })
    })
})