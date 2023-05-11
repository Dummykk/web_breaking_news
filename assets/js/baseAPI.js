// 每次调用$.get()或$.post()或$.ajax()的时候，会先调用ajaxPrefilter()函数，在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 为需要身份认证的接口添加Authorization属性
    if (options.url.indexOf('/my/') !== -1) {
        // 统一为有权限的接口，设置headers请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

        // 无论请求成功还是失败，最终都会调用complete回调函数
        options.complete = res => {
            //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空token
                localStorage.removeItem('token')
                // 2. 强制跳转到登录页
                location.href = '/login.html'
            }
        }
    }

})