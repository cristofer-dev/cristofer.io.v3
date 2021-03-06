import React from 'react'
import Helmet from 'react-helmet'

export default function Template({ data }) {
  const post = data.markdownRemark
  return (
    <div className="blog-post-container">
      <Helmet title={`Cristofer.io - ${post.frontmatter.title}`} />
      <div className="blog-post">
        <div>
          <img
            src={`static/img/${post.frontmatter.image}`}
            width="100%"
            height="150px"
          />
        </div>
        <h1>{post.frontmatter.title}</h1>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        image
      }
    }
  }
`
