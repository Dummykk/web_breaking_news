$(function () {
    let layer = layui.layer
    let form = layui.form

    initArtCateList()

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addCate').html()
        })
    })

    // form-add表单是动态创建出来的，所以需要通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
                initArtCateList()
            }
        })
    })


    let indexEdit = null
    $('tbody').on('click', '.btnEdit', function () {
        // 弹出编辑层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#editCate').html()
        })
        // 填充原始数据
        let id = $(this).attr('data-id')
        // 发送请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: res => {
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('修改失败！')
                }
                layer.msg('修改成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    $('body').on('click', '#btnEditReset', function (e) {
        e.preventDefault()
        let id = $('input[name=Id]').val()
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: res => {
                form.val('form-edit', res.data)
            }
        })
    })

    $('tbody').on('click', '.btnDelete', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });
    })


})