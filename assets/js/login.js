$(function () {
    // 点击“注册账号”的链接
    $('#link_reg').click(function () {
        $('.login-box').fadeOut(200, function () {
            $('.reg-box').fadeIn(200)
        })

    })

    // 点击“有账号？去登录”的链接
    $('#link_login').click(function () {
        $('.reg-box').fadeOut(200, function () {
            $('.login-box').fadeIn(200)
        })
    })

    // 从layui中获取form和layer对象
    let form = layui.form
    let layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        repwd: value => {
            // 拿到密码框中的内容
            let pwd = $('.reg-box input[name=password]').val()
            if (pwd !== value) {
                return '两次输入的密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').submit(function (e) {
        e.preventDefault()  // 阻止默认提交行为
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val()
            },
            success: res => {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功！请登录')
                $('#link_login').click()    // 跳转到登录界面
            }
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),  // 快速获取表单中的数据
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                location.href = '/index.html'   // 跳转到后台主页
            }
        })
    })
})