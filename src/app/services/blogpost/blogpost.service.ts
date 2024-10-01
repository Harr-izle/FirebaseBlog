import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { IComment } from '../../models/comment';
import { IPost } from '../../models/post';

@Injectable({
  providedIn: 'root'
})
export class BlogpostService {
  private postsCollection: AngularFirestoreCollection<IPost>;
  private commentsCollection: AngularFirestoreCollection<IComment>;

  constructor(private firestore: AngularFirestore) {
    this.postsCollection = this.firestore.collection<IPost>('posts');
    this.commentsCollection = this.firestore.collection<IComment>('comments');
  }

  // CRUD operations for posts
  getPosts(): Observable<IPost[]> {
    return this.postsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IPost;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
  }

  getPost(id: string): Observable<IPost | undefined> {
    return this.postsCollection.doc<IPost>(id).valueChanges({ idField: 'id' });
  }

  addPost(post: Omit<IPost, 'id'>): Promise<DocumentReference<IPost>> {
    return this.postsCollection.add(post);
  }

  updatePost(id: string, post: Partial<IPost>): Promise<void> {
    return this.postsCollection.doc(id).update({
      ...post,
      updatedAt: new Date()
    });
  }

  deletePost(id: string): Promise<void> {
    return this.postsCollection.doc(id).delete();
  }

  // CRUD operations for comments
  getCommentsForPost(postId: string): Observable<IComment[]> {
    return this.firestore.collection<IComment>('comments', ref => 
      ref.where('postId', '==', postId).orderBy('createdAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IComment;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
  }

  addComment(comment: Omit<IComment, 'id'>): Promise<DocumentReference<IComment>> {
    return this.commentsCollection.add(comment);
  }

  updateComment(id: string, comment: Partial<IComment>): Promise<void> {
    return this.commentsCollection.doc(id).update({
      ...comment,
      updatedAt: new Date()
    });
  }

  deleteComment(id: string): Promise<void> {
    return this.commentsCollection.doc(id).delete();
  }

}
