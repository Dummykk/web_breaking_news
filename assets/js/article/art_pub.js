$(function () {
    let layer = layui.layer
    let form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('select[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseCover').click(function () {
        $('#coverFile').click()
    })

    // 监听文件选择框的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的URL地址
        let newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })

    // 定义文章的发布状态
    let art_state = '已发布'

    $('#btnSave').click(function () {
        art_state = '草稿'
    })

    $('#form-pub').submit(function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于form表单，快速创建一个FormData对象
        let fd = new FormData($(this)[0])

        // 3. 将文章的发布状态存到fd中
        fd.append('state', art_state)

        /* fd.forEach((v, k) => {
            console.log(k, v)
        }) */

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {  // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象存储到fd中
                fd.append('cover_img', blob)
                publishArticle(fd) // 要写在回调函数里，若写在外面，则会在cover_img属性添加到fd前调用publishArticle()发起请求，缺少cover_img参数从而请求失败
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：jQuery向服务器提交FormData格式的数据时，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})