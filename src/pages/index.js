import React from 'react'
import Link from 'gatsby-link'


export default function Index({ data }) {
  const { edges: posts } = data.allMarkdownRemark;
  return (
    <div className="blog-posts wrapperBlog">
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .map(({ node: post }) => {
          return (
            <div className="blog-post-preview" key={post.id}>
              <div>
                <img src={'assets/img/' + post.frontmatter.image} width="100%" height="100px" />
              </div>
              
              <div className="date">{post.frontmatter.date}</div>
              <div className="title">
                <Link to={post.frontmatter.path}>{post.frontmatter.title}</Link>
              </div>
              <p>{post.excerpt}</p>
            </div>
          );
        })}
    </div>
  );
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 100)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            image
          }
        }
      }
    }
  }
`;
