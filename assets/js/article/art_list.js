$(function () {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义一个查询的参数对象，请求数据的时候需要将请求参数对象提交服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页的数9据条数，默认每页显示2条
        cate_id: '', // 文章分类的Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

    // 定义获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                console.log(res)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = date => {
        let dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 定义时间补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                $('select[name=cate_id]').html(htmlStr)
                // 重新让layui渲染表单区域的UI结构
                form.render()
            }
        })
    }

    $('#form-search').submit(function (e) {
        e.preventDefault()

        let cate_id = $('select[name=cate_id]').val()
        let state = $('select[name=state]').val()
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            limits: [5, 10],
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 触发jump回调的方式有两种：
            // 1. 分页被切换，first为undefined
            // 2. 调用laypage.render()，first为true
            jump: (obj, first) => {
                // 通过first的值来判断是通过何种方式触发的jump回调
                if (!first) {
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    initTable()
                }
            }
        })
    }

    $('tbody').on('click', '.btnDelete', function () {
        let id = $(this).attr('data-id')
        let btnDelCount = $('.btnDelete').length

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    layer.close(index)
                    // 当数据删除后，需要判断当前页面是否还有剩余数据，若没有，则让页码值-1后再调用initTable()方法
                    if (btnDelCount === 1) {
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
        })
    })
})